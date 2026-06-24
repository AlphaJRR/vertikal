import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  DEFAULT_GEAR_ITEMS,
  formatCurrency,
  GearLineItem,
  IRS_MILEAGE_RATE,
  parseAmount,
  PROJECT_TYPES,
  ProjectType,
  QUOTE_STEPS,
  SKILL_LEVELS,
  SkillLevel,
} from "../../data/rateCalculatorData";
import { rateCalculatorStyles as s } from "./rateCalculatorStyles";
import { isRateCalculatorQuoteProLocked } from "../../constants/proAccess";
import { useAvaPro } from "../../hooks/useAvaPro";
import { useProjects } from "../../hooks/useProjects";
import { showProUpgradeAlert } from "../../utils/showProUpgradeAlert";
import { ProjectPickerModal } from "../projects/ProjectPickerModal";

interface RateCalculatorProps {
  onBack?: () => void;
}

interface QuoteLine {
  id: string;
  label: string;
  amount: number;
}

export function RateCalculator({ onBack }: RateCalculatorProps) {
  const insets = useSafeAreaInsets();
  const { isPro, isSignedIn } = useAvaPro();
  const { projects, attachQuote } = useProjects();
  const [step, setStep] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Step 1 — Project
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("commercial");

  // Step 2 — Labor
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("intermediate");
  const [prepHours, setPrepHours] = useState("4");
  const [shootHours, setShootHours] = useState("8");
  const [editHours, setEditHours] = useState("12");

  // Step 3 — Gear
  const [gearItems, setGearItems] = useState<GearLineItem[]>(() =>
    DEFAULT_GEAR_ITEMS.map((item) => ({
      ...item,
      enabled: true,
    })),
  );

  // Step 4 — Travel
  const [miles, setMiles] = useState("0");
  const [perDiemDays, setPerDiemDays] = useState("0");
  const [perDiemRate, setPerDiemRate] = useState("75");
  const [parking, setParking] = useState("0");
  const [meals, setMeals] = useState("0");

  const skill = SKILL_LEVELS.find((l) => l.id === skillLevel)!;
  const hourlyRate = skill.hourlyRate;

  const laborTotal = useMemo(() => {
    const prep = parseAmount(prepHours);
    const shoot = parseAmount(shootHours);
    const edit = parseAmount(editHours);
    return (prep + shoot + edit) * hourlyRate;
  }, [prepHours, shootHours, editHours, hourlyRate]);

  const gearTotal = useMemo(
    () =>
      gearItems
        .filter((g) => g.enabled)
        .reduce((sum, g) => sum + g.defaultAmount, 0),
    [gearItems],
  );

  const mileageTotal = useMemo(
    () => parseAmount(miles) * IRS_MILEAGE_RATE,
    [miles],
  );

  const travelTotal = useMemo(() => {
    const diem = parseAmount(perDiemDays) * parseAmount(perDiemRate);
    return mileageTotal + diem + parseAmount(parking) + parseAmount(meals);
  }, [mileageTotal, perDiemDays, perDiemRate, parking, meals]);

  const quoteLines: QuoteLine[] = useMemo(() => {
    const prep = parseAmount(prepHours);
    const shoot = parseAmount(shootHours);
    const edit = parseAmount(editHours);
    const lines: QuoteLine[] = [];

    if (prep > 0) {
      lines.push({
        id: "prep",
        label: `Pre-production (${prep}h × ${formatCurrency(hourlyRate)}/hr)`,
        amount: prep * hourlyRate,
      });
    }
    if (shoot > 0) {
      lines.push({
        id: "shoot",
        label: `Production (${shoot}h × ${formatCurrency(hourlyRate)}/hr)`,
        amount: shoot * hourlyRate,
      });
    }
    if (edit > 0) {
      lines.push({
        id: "edit",
        label: `Post-production (${edit}h × ${formatCurrency(hourlyRate)}/hr)`,
        amount: edit * hourlyRate,
      });
    }

    gearItems
      .filter((g) => g.enabled)
      .forEach((g) => {
        lines.push({ id: g.id, label: g.label, amount: g.defaultAmount });
      });

    const mileCount = parseAmount(miles);
    if (mileCount > 0) {
      lines.push({
        id: "mileage",
        label: `Travel mileage (${mileCount} mi × $${IRS_MILEAGE_RATE})`,
        amount: mileageTotal,
      });
    }

    const diemDays = parseAmount(perDiemDays);
    const diemRate = parseAmount(perDiemRate);
    if (diemDays > 0) {
      lines.push({
        id: "perdiem",
        label: `Per diem (${diemDays} days × ${formatCurrency(diemRate)})`,
        amount: diemDays * diemRate,
      });
    }

    const park = parseAmount(parking);
    if (park > 0) lines.push({ id: "parking", label: "Parking", amount: park });

    const meal = parseAmount(meals);
    if (meal > 0) lines.push({ id: "meals", label: "Meals", amount: meal });

    return lines;
  }, [
    prepHours,
    shootHours,
    editHours,
    hourlyRate,
    gearItems,
    miles,
    mileageTotal,
    perDiemDays,
    perDiemRate,
    parking,
    meals,
  ]);

  const quotedTotal = laborTotal + gearTotal + travelTotal;

  const updateGearAmount = (id: string, value: string) => {
    setGearItems((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, defaultAmount: parseAmount(value) } : g,
      ),
    );
  };

  const toggleGear = (id: string) => {
    setGearItems((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g)),
    );
  };

  const tap = (fn: () => void) => () => {
    Haptics.selectionAsync().catch(() => {});
    fn();
  };

  const goNext = () => setStep((n) => Math.min(n + 1, 5));
  const goBack = () => setStep((n) => Math.max(n - 1, 1));

  const saveQuoteToProject = async (projectId?: string) => {
    const client = clientName.trim() || "Client";
    const project = projectName.trim() || "Untitled project";
    const saved = await attachQuote({
      projectId,
      projectName:  project,
      clientName:   client,
      projectType,
      totalCents:   Math.round(quotedTotal * 100),
    });
    if (saved) {
      Alert.alert(
        "Saved to project",
        `${formatCurrency(quotedTotal)} quote linked to "${saved.name}". Stage set to Quote sent.`,
      );
    } else {
      Alert.alert("Could not save", "Sign in and run migration 013 if projects fail to save.");
    }
  };

  const handleSendQuote = () => {
    if (!isPro && isRateCalculatorQuoteProLocked()) {
      showProUpgradeAlert(isSignedIn, "feature");
      return;
    }
    if (projects.length === 0) {
      void saveQuoteToProject();
      return;
    }
    setPickerOpen(true);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={s.card}>
            <Text style={s.cardTitle}>Project Details</Text>
            <Text style={s.cardHint}>
              Start with client and project info. National averages pre-fill later
              steps.
            </Text>
            <Text style={s.label}>Client name</Text>
            <TextInput
              value={clientName}
              onChangeText={setClientName}
              placeholder="Acme Corp"
              placeholderTextColor="#444"
              style={s.input}
            />
            <Text style={s.label}>Project name</Text>
            <TextInput
              value={projectName}
              onChangeText={setProjectName}
              placeholder="Brand launch video"
              placeholderTextColor="#444"
              style={s.input}
            />
            <Text style={s.label}>Project type</Text>
            <View style={s.chipRow}>
              {PROJECT_TYPES.map((pt) => {
                const active = pt.id === projectType;
                return (
                  <Pressable
                    key={pt.id}
                    onPress={tap(() => setProjectType(pt.id))}
                    style={[s.chip, active && s.chipActive]}
                  >
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>
                      {pt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );

      case 2:
        return (
          <>
            <View style={s.card}>
              <Text style={s.cardTitle}>Skill Level</Text>
              <Text style={s.cardHint}>
                Hourly baselines reflect 2026 US national averages for video
                production.
              </Text>
              {SKILL_LEVELS.map((level) => {
                const active = level.id === skillLevel;
                return (
                  <Pressable
                    key={level.id}
                    onPress={tap(() => setSkillLevel(level.id))}
                    style={[s.skillCard, active && s.skillCardActive]}
                  >
                    <Text style={s.skillLabel}>{level.label}</Text>
                    <Text style={s.skillRate}>
                      {formatCurrency(level.hourlyRate)}/hr
                    </Text>
                    <Text style={s.skillDesc}>{level.description}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={s.card}>
              <Text style={s.cardTitle}>Labor Hours</Text>
              <Text style={s.label}>Pre-production (hours)</Text>
              <TextInput
                value={prepHours}
                onChangeText={setPrepHours}
                keyboardType="numeric"
                style={s.input}
              />
              <Text style={s.label}>Production / shoot (hours)</Text>
              <TextInput
                value={shootHours}
                onChangeText={setShootHours}
                keyboardType="numeric"
                style={s.input}
              />
              <Text style={s.label}>Post-production / edit (hours)</Text>
              <TextInput
                value={editHours}
                onChangeText={setEditHours}
                keyboardType="numeric"
                style={s.input}
              />
              <Text style={s.quotedLabel}>Labor subtotal</Text>
              <Text style={[s.quotedTotal, { fontSize: 32 }]}>
                {formatCurrency(laborTotal)}
              </Text>
            </View>
          </>
        );

      case 3:
        return (
          <View style={s.card}>
            <Text style={s.cardTitle}>Gear & Crew</Text>
            <Text style={s.cardHint}>
              Pre-filled with national average day rates. Toggle off items you
              are not billing.
            </Text>
            {gearItems.map((item) => (
              <View key={item.id} style={s.gearRow}>
                <Switch
                  value={item.enabled}
                  onValueChange={() => toggleGear(item.id)}
                  trackColor={{ false: "#333", true: "rgba(232,0,10,0.4)" }}
                  thumbColor={item.enabled ? "#E8000A" : "#666"}
                />
                <Text
                  style={[s.lineItemLabel, { flex: 1 }]}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
                <TextInput
                  value={String(item.defaultAmount)}
                  onChangeText={(v) => updateGearAmount(item.id, v)}
                  keyboardType="numeric"
                  editable={item.enabled}
                  style={[s.gearInput, !item.enabled && { opacity: 0.4 }]}
                />
              </View>
            ))}
            <Text style={s.quotedLabel}>Gear subtotal</Text>
            <Text style={[s.quotedTotal, { fontSize: 32 }]}>
              {formatCurrency(gearTotal)}
            </Text>
          </View>
        );

      case 4:
        return (
          <View style={s.card}>
            <Text style={s.cardTitle}>Travel & Expenses</Text>
            <Text style={s.cardHint}>
              IRS standard mileage rate for 2026 business travel.
            </Text>
            <Text style={s.label}>Miles driven</Text>
            <TextInput
              value={miles}
              onChangeText={setMiles}
              keyboardType="numeric"
              style={s.input}
            />
            <Text style={s.mileageNote}>
              {parseAmount(miles) > 0
                ? `${parseAmount(miles)} mi × $${IRS_MILEAGE_RATE} = ${formatCurrency(mileageTotal)}`
                : `Rate: $${IRS_MILEAGE_RATE}/mile (IRS 2026)`}
            </Text>
            <Text style={s.label}>Per diem days</Text>
            <TextInput
              value={perDiemDays}
              onChangeText={setPerDiemDays}
              keyboardType="numeric"
              style={s.input}
            />
            <Text style={s.label}>Per diem rate ($/day)</Text>
            <TextInput
              value={perDiemRate}
              onChangeText={setPerDiemRate}
              keyboardType="numeric"
              style={s.input}
            />
            <Text style={s.label}>Parking</Text>
            <TextInput
              value={parking}
              onChangeText={setParking}
              keyboardType="numeric"
              style={s.input}
            />
            <Text style={s.label}>Meals</Text>
            <TextInput
              value={meals}
              onChangeText={setMeals}
              keyboardType="numeric"
              style={s.input}
            />
            <Text style={s.quotedLabel}>Travel subtotal</Text>
            <Text style={[s.quotedTotal, { fontSize: 32 }]}>
              {formatCurrency(travelTotal)}
            </Text>
          </View>
        );

      case 5:
        return (
          <>
            <View style={s.card}>
              <Text style={s.cardTitle}>Quote Summary</Text>
              {clientName.trim() ? (
                <Text style={s.cardHint}>
                  {clientName.trim()}
                  {projectName.trim() ? ` · ${projectName.trim()}` : ""}
                </Text>
              ) : null}
              {quoteLines.length === 0 ? (
                <View style={[s.lineItem, s.lineItemZero]}>
                  <Text style={s.lineItemLabel}>No line items yet</Text>
                  <Text style={[s.lineItemAmount, s.lineItemAmountZero]}>
                    $0
                  </Text>
                </View>
              ) : (
                quoteLines.map((line) => {
                  const isZero = line.amount === 0;
                  return (
                    <View
                      key={line.id}
                      style={[s.lineItem, isZero && s.lineItemZero]}
                    >
                      <Text style={s.lineItemLabel}>{line.label}</Text>
                      <Text
                        style={[
                          s.lineItemAmount,
                          isZero && s.lineItemAmountZero,
                        ]}
                      >
                        {formatCurrency(line.amount)}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
            <View style={s.card}>
              <Text style={s.quotedLabel}>Quoted price</Text>
              <Text style={s.quotedTotal}>{formatCurrency(quotedTotal)}</Text>
            </View>
            <Pressable onPress={handleSendQuote} style={s.btnPrimary}>
              <Text style={s.btnPrimaryTxt}>Save quote to project</Text>
            </Pressable>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={[
        s.content,
        {
          paddingTop: onBack ? 8 : 12,
          paddingBottom: insets.bottom + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {onBack ? (
        <Pressable onPress={onBack} style={s.backRow}>
          <Ionicons name="chevron-back" size={20} color="#E8000A" />
          <Text style={s.backTxt}>Toolkit</Text>
        </Pressable>
      ) : null}

      <View style={s.header}>
        <Text style={s.eyebrow}>Creator Tools</Text>
        <Text style={s.title}>Rate Calculator</Text>
        <Text style={s.subtitle}>
          Build a professional quote in 5 steps with national average baselines.
        </Text>
      </View>

      <View style={s.stepRow}>
        {QUOTE_STEPS.map((st) => (
          <View
            key={st.id}
            style={[s.stepDot, st.id <= step && s.stepDotActive]}
          />
        ))}
      </View>
      <View style={s.stepLabels}>
        {QUOTE_STEPS.map((st) => (
          <Text
            key={st.id}
            style={[s.stepLabel, st.id === step && s.stepLabelActive]}
          >
            {st.label}
          </Text>
        ))}
      </View>

      {renderStep()}

      {step < 5 ? (
        <View style={s.navRow}>
          {step > 1 ? (
            <Pressable onPress={tap(goBack)} style={s.btnSecondary}>
              <Text style={s.btnSecondaryTxt}>Back</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={tap(goNext)}
            style={[s.btnPrimary, step === 1 && { flex: 1 }]}
          >
            <Text style={s.btnPrimaryTxt}>Next</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={tap(goBack)} style={[s.btnSecondary, { marginTop: 8 }]}>
          <Text style={s.btnSecondaryTxt}>Edit Quote</Text>
        </Pressable>
      )}

      <ProjectPickerModal
        visible={pickerOpen}
        projects={projects}
        onClose={() => setPickerOpen(false)}
        onSelect={(id) => {
          setPickerOpen(false);
          void saveQuoteToProject(id);
        }}
        onCreateNew={() => {
          setPickerOpen(false);
          void saveQuoteToProject();
        }}
      />
    </ScrollView>
  );
}

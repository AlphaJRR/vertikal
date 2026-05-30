import React from "react";
import {
  Image,
  ImageSourcePropType,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

const SHOP_URL = "https://shop.alphavisualartists.com";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: string;
  img: ImageSourcePropType;
};

const PRODUCTS: Product[] = [
  {
    id: "pink",
    name: "ALPHA Creative Tee — Pink",
    desc: "Heavyweight oversized fit",
    price: "$45.00",
    img: require("../../assets/images/tee-pink.jpg"),
  },
  {
    id: "green",
    name: "ALPHA Creative Tee — Forest",
    desc: "Heavyweight oversized fit",
    price: "$45.00",
    img: require("../../assets/images/tee-green.jpg"),
  },
  {
    id: "chicago",
    name: "Chicago Back Print Tee",
    desc: "Full back graphic — limited drop",
    price: "$55.00",
    img: require("../../assets/images/tee-chicago.jpg"),
  },
  {
    id: "bundle",
    name: "Crew Collection Bundle",
    desc: "Mix & match — save on 3+ pieces",
    price: "From $120.00",
    img: require("../../assets/images/crew-group.jpg"),
  },
];

const LIFESTYLE: ImageSourcePropType[] = [
  require("../../assets/images/blackaf-walk.jpg"),
  require("../../assets/images/tee-flex.jpg"),
  require("../../assets/images/tee-trees.jpg"),
  require("../../assets/images/bts-papi.jpg"),
];

const STATS = [
  { num: "17", label: "Styles available" },
  { num: "100%", label: "Cotton heavyweight" },
  { num: "Set", label: "Tested & approved" },
  { num: "AVA15", label: "15% off first order" },
];

const COLS = [
  {
    h: "On the clock",
    p: "Wear ALPHA when you're directing, shooting, or building something real.",
    badge: "Set wear",
  },
  {
    h: "Off the clock",
    p: "Crew apparel for everything else. Studio, coffee shop, anywhere.",
    badge: "Street wear",
  },
  {
    h: "For anyone",
    p: "You don't have to be on set to wear ALPHA. Just create.",
    badge: "Creator wear",
  },
];

export default function ShopScreen() {
  const open = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    WebBrowser.openBrowserAsync(url, {
      toolbarColor: "#0a0a0a",
      controlsColor: "#00d4ff",
    }).catch(() => {
      Linking.openURL(url).catch(() => {});
    });
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <View style={[styles.hero, { paddingTop: 12 }]}>
        <Text style={styles.eyebrow}>AVA Apparel — Crew Collection</Text>
        <Text style={styles.h1}>
          Made for the crew & creators.
          {"\n"}
          <Text style={styles.cyan}>Worn by everyone.</Text>
        </Text>
        <Text style={styles.heroSub}>
          Built for production days. Designed for those who create. Apparel
          built for discipline, precision, and the standard of excellence
          required when the lights come on.
        </Text>
        <View style={styles.heroBtns}>
          <Pressable
            onPress={() => open(SHOP_URL)}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryTxt}>Shop the collection</Text>
          </Pressable>
          <Pressable
            onPress={() => open(SHOP_URL)}
            style={styles.btnSecondary}
          >
            <Text style={styles.btnSecondaryTxt}>Browse all</Text>
          </Pressable>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsBox}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* QUOTE 1 */}
      <View style={styles.quote}>
        <Text style={styles.quoteH}>
          Creators don't just make things. They make the world{" "}
          <Text style={styles.cyan}>make sense.</Text>
        </Text>
        <Text style={styles.quoteP}>For everyone who stays creating.</Text>
      </View>

      {/* PRODUCTS */}
      <Text style={styles.sectionTitle}>Shop the drop</Text>
      <View style={styles.productGrid}>
        {PRODUCTS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => open(SHOP_URL)}
            style={styles.product}
          >
            <Image source={p.img} style={styles.productImg} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productDesc}>{p.desc}</Text>
              <Text style={styles.productPrice}>{p.price}</Text>
              <View style={styles.productBtn}>
                <Text style={styles.productBtnTxt}>Shop now</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* DIVIDER */}
      <View style={styles.divider}>
        <Text style={styles.dividerH}>
          On the <Text style={styles.cyan}>streets.</Text>
          {"\n"}Worn by the <Text style={styles.cyan}>crew.</Text>
        </Text>
      </View>

      {/* LIFESTYLE GRID */}
      <View style={styles.lifestyleGrid}>
        {LIFESTYLE.map((src, i) => (
          <View key={i} style={styles.lifestyleItem}>
            <Image source={src} style={styles.lifestyleImg} />
          </View>
        ))}
      </View>

      {/* QUOTE 2 */}
      <View style={styles.quote}>
        <Text style={styles.quoteH}>
          The streets don't care what you make.
          {"\n"}
          <Text style={styles.cyan}>Neither do we.</Text>
        </Text>
        <Text style={styles.quoteP}>Real recognizes real.</Text>
      </View>

      {/* THREE COL */}
      <View style={styles.threeCol}>
        {COLS.map((c) => (
          <View key={c.h} style={styles.colItem}>
            <Text style={styles.colH}>{c.h}</Text>
            <Text style={styles.colP}>{c.p}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{c.badge}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* QUOTE 3 */}
      <View style={styles.quote}>
        <Text style={styles.quoteH}>
          Every great artist was once a kid who{" "}
          <Text style={styles.cyan}>refused to stop.</Text>
        </Text>
        <Text style={styles.quoteP}>Keep creating.</Text>
      </View>

      {/* DIVIDER 2 */}
      <View style={styles.divider}>
        <Text style={styles.dividerH}>
          Built for the <Text style={styles.cyan}>set.</Text>
          {"\n"}Made for{" "}
          <Text style={styles.cyan}>everything else.</Text>
        </Text>
      </View>

      {/* FOOTER CTA */}
      <View style={styles.footerCta}>
        <Text style={styles.footerH}>
          Wear the
          {"\n"}
          <Text style={styles.cyan}>vision.</Text>
        </Text>
        <Text style={styles.footerP}>
          ALPHA CREW doesn't care if you're directing a feature or a first
          date. Show up like you mean it.
        </Text>
        <Pressable
          onPress={() => open(SHOP_URL)}
          style={[styles.btnPrimary, { marginTop: 8 }]}
        >
          <Text style={styles.btnPrimaryTxt}>Shop all styles</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  cyan: { color: "#00d4ff" },

  // HERO
  hero: { paddingHorizontal: 24, paddingBottom: 40, alignItems: "center" },
  eyebrow: {
    fontSize: 11,
    color: "#00d4ff",
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 18,
    textAlign: "center",
  },
  h1: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 42,
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 18,
  },
  heroSub: {
    color: "#b0b0b0",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  heroBtns: { flexDirection: "row", gap: 10, flexWrap: "wrap", justifyContent: "center" },
  btnPrimary: {
    backgroundColor: "#00d4ff",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnPrimaryTxt: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  btnSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#00d4ff",
  },
  btnSecondaryTxt: {
    color: "#00d4ff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // STATS
  statsBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#222",
  },
  statItem: { width: "50%", alignItems: "center", paddingVertical: 12 },
  statNum: {
    color: "#00d4ff",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLbl: {
    color: "#999",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },

  // QUOTE
  quote: {
    margin: 20,
    padding: 24,
    backgroundColor: "#111",
    borderLeftWidth: 4,
    borderLeftColor: "#00d4ff",
    borderRadius: 4,
  },
  quoteH: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  quoteP: {
    color: "#999",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 14,
  },

  // SECTION TITLE
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },

  // PRODUCTS
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
  },
  product: {
    width: "48%",
    backgroundColor: "#111",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1a1a1a",
    marginBottom: 4,
  },
  productImg: { width: "100%", height: 200, backgroundColor: "#1a1a1a" },
  productInfo: { padding: 14 },
  productName: { color: "#fff", fontSize: 13, fontWeight: "700", marginBottom: 4 },
  productDesc: { color: "#999", fontSize: 11, marginBottom: 8 },
  productPrice: {
    color: "#00d4ff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  productBtn: {
    backgroundColor: "#00d4ff",
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
  },
  productBtnTxt: {
    color: "#000",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // DIVIDER
  divider: { paddingHorizontal: 24, paddingVertical: 32, alignItems: "center" },
  dividerH: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    textAlign: "center",
    letterSpacing: -0.5,
  },

  // LIFESTYLE
  lifestyleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
    marginBottom: 24,
  },
  lifestyleItem: {
    width: "48%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  lifestyleImg: { width: "100%", aspectRatio: 1 },

  // THREE COL
  threeCol: { paddingHorizontal: 20, gap: 14, marginVertical: 8 },
  colItem: {
    backgroundColor: "#111",
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    alignItems: "center",
  },
  colH: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  colP: {
    color: "#999",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
    textAlign: "center",
  },
  badge: {
    backgroundColor: "#00d4ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeTxt: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // FOOTER CTA
  footerCta: { paddingHorizontal: 24, paddingTop: 40, alignItems: "center" },
  footerH: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
    lineHeight: 46,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 18,
  },
  footerP: {
    color: "#999",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 16,
  },
});

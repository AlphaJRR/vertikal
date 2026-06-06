-- AVA Pro subscription tier on profiles
-- Demo user appreview@alphavisualartists.com must be set pro manually in dashboard

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro'));

-- Backfill existing rows (safe if column was added without NOT NULL elsewhere)
UPDATE public.profiles
SET subscription_tier = 'free'
WHERE subscription_tier IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.protect_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    -- Dashboard / direct postgres: auth.jwt() is NULL → allow
    IF auth.jwt() IS NOT NULL
       AND COALESCE(auth.jwt()->>'role', '') NOT IN ('service_role', 'postgres') THEN
      RAISE EXCEPTION 'subscription_tier cannot be changed by clients'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_profiles_subscription_tier ON public.profiles;

CREATE TRIGGER protect_profiles_subscription_tier
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_tier();

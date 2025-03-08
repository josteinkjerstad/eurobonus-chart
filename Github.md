# Oppsett av Github login

Supabase + Astro støtter de fleste vanlige auth providers og vi vil i dette eksempelet gå gjennom hvordan man kan sette opp innlogging på nettsiden med `GitHub`. I Supabase kan man under Authentication under `Users` se hvilke brukere som har signet opp til providerene man setter opp.

> NB: Dette vil kun fungere etter man har deployet til vercel. Oppsett av oauth-flowen i localhost krever en del mer jobb.

## Opprette en Github OAuth App 
For å kunne bruke Github som service provider trenger man å opprette en Oauth App hos Github  

1. [Åpne Github Developer Settings](https://github.com/settings/developers)
2. Opprett en ny OAuth app
   - `Homepage URL`: Her limer du inn URL'n til vercel-appen din (som vil se ca. sånn ut: https://supabase-astro-2025-xxx.vercel.app)
   - `Authorization Callback URL`: Denne fyller vi ut senere.
   - Ikke huk av for Enable Device Flow.
3. Generer en `Client Secret` og ta vare på denne sammen med `ClientId`.
4. Ikke lukk vinduet!

## Aktivering av Github i Supabase 
1. Åpne Supabase dashboardet og naviger til Authentication -> Sign In/Up
2. Aktiver deretter Github som provider og legg inn `ClientId` og `ClientSecret` fra appen du nettopp opprettet på Github.
3. Kopier `Callback URL` og lim inn denne under `Authorization Callback URL` i github appen din.

## Oppsett av auth i koden
Vi har på forånd satt opp de nødvendige server side filene som trengs for å komme i gang med auth providers. Disse finner dere under `.pages/api/auth`. 

### Sign in
Denne filen tar seg av flyten av innlogging til providers og setter cookies etter man har autentisert seg. Dette skjer med at man oppretter en ServerClient mot supabase. For enkelhetsskyld oppretter vi her en egen serverClient i hver fil hvor vi trenger tilgang til supabase.

```typescript
const { cookies, redirect, request } = Astro;
const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, options)
          );
        },
      },
    }
  );
  ```

Deretter kan man kalle `supabase.auth.signInWithOAuth`. Erstatt `redirectTo` med din egen prod-url til vercel appn. 

```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
   provider: provider as Provider,
   options: {
     redirectTo: "https://put-in-your-url.vercel.app/api/auth/callback"
   },
 });
 ```


### Sign out
For å logge ut kaller man bare ```supabase.auth.signOut();```

### Callback
I tillegg til logikk for sign in/out trenger man en callback fil som tar seg av flyten fra auth provideren.

### Hente ut inlogget bruker
Brukerinfo om innlogget bruker kan hentes fra supabase med et enkelt kall.  

```const {data} = await supabase.auth.getUser();```

## Oppgave
Det eneste som mangler nå er en knapp eller egen side på hjemmesiden for å logge inn.

- Lag en knapp eller et sted på siden hvor man kan logge inn.
- Etter velykket innlogging kan man feks bli redirected til et dashboard eller en profilside 
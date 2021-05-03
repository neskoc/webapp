# Kursmoment 04

Tyvärr blev det igen en försening av inlämningen men det finns tid att komma ikapp denna vecka.  
Den här gången bestämde jag mig att migrera resten av funktionaliteten till lager4. Det blev en hel del slit för vissa upplägg passade inte in direkt.  
Jag kämpade en hel del med asynkrona funktioner och även spenderade flera timmar upprepade gånger på grund av att jag litade blint på autocomplete i VSC.
Det blev onClick i stället för onclick vilket jag upplevde som väldigt svårt att felsöka.

En del av problemen låg i att jag sparade (försökte spara) data i view samt återanvända sedan. När jag gick över till model-filerna blev det plöstligt mycket bättre.  
Så allt i allo har det blivit en hel del extra timmar och sena nätter men jag tror att jag har åtminstone fått mycket bättre känsla för hur Mithril fungerar.  
Jag är inte jätteduktig men jag klarar mig hyfsat numera.

## Ny funktionalitet

Login och JWT har jag upplevt som ganska enkelt både att förstå och implementera, även Content-Security-Policy för den delen.

Till skillnad från sessioner är JWT standardiserad och använder sig av (kompakta) JSON-objekt. En annan skillnad är att användarstatus (state) aldrig sparas i serverminnet samt behöver inte slås upp i någon databas. Med andra ord det ett stateless API samt kan lätt återanvändas över ett brett område i fall man använder någon form av federerad autentiseringsmekanism.
JWT är integrerat i http-protokollet och http är ett "stateless" protokoll.

En annan fördel är att JWT har inbyggt krypteringsstöd vilket måste hanteras separat för sessionerna. Å andra sidan JWT har mer overhead så allt är inte guld och gröna skogar.

Det nämns också att JWT passar väl ihop med RESTful API-tjänster men jag är ingen expert på det så jag får bara acceptera detta som en fördel.

## Design

Den här gången blev det inte så mycket nytt och alla css-regler fick vi på köpet så det var bara att implementera.  
Personligen gillar jag inte (snarare hatar det) om jag måste förflytta innehåll i sidled för att komma åt viktig information (vem har sagt dbwebb.se och kodrutorna?) så jag undviker helst detta om det finns risk att det inträffar.

Samtidigt är det en mycket mer överskådligt och naturligt sätt att presentera tabellerad information än att lagga raderna ovanpå varandra.

Med andra ord väljer jag helst äkta tabeller om man har bra kontroll över bredden så att man är säker på att förflyttning i sidled aldrig inträffar annars blir det "stack".

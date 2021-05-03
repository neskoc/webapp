# Kursmoment 05

I detta kursmoment har jag valt att inte lägga så mycket tid på extra saker så jag har inte lagt för mycket tid på att ändra GUI.  
Dessutom har jag testat appen i browser och android-emulatorn men inte på en fysisk enhet. Eventuellt testar jag en äkta android-telefon i kmom06.

Jag fick en del problem att installera cordova-miljö för java8 är rätt så udda fågel numera men efter lite googlande, test och risktagning att ladda ner packet från okänd tredjepart gick det till slut bra.

## Ny funktionalitet

För det mesta har arbetet gått relativt fort så jag valde också att försöka få till skrivning och läsning från lokala filsystemet.  
Detta gick si så där. Jag lade kanske 5-6 timmar på det men har inte fått lagring på en emulator. I browser har det däremot gått bra.
Jag frågade om hjälp i discord men det var sent eftermiddag och inget svar så jag valde att gå vidare i stället.

Min "lösning" blev att jag anpassade koden så att den fungerar både i browser med filläsning/skrivning och i android-emulatorn där den hoppar över det.
Annars har jag valt att spara token lokalt så att det kan återanvändas.  
Koden kollar om token finns och om det giltigt annars får man logga in för att få ett nytt token.

## Design

Som jag skrev i inledningen har jag valt att inte lägga så mycket tid på GUI.  
Jag tycker att min app inte avviker i någon större grad mot de enklare apparna som finns på emulator så jag tror inte jag skulle kunna göra det så mycket bättre ändå.  
I och med att jag redan från början tagit fram en bild och ikon spenderade jag ingen tid på att leta/ta fram lämpliga bilder vilket annars för min del brukar vara rätt så tidskrävande.

Att göra om de befintliga bilderna till logga och splashscreen gick bra men resultatet av Abiro Cordova är jag inte så nöjd med.
Den genererar någon märklig ikon över bild splashscreen-effekt.  
Tydligen har vi olika uppfattningar vad en ikon är ock skall användas till.
Men jag har valt att låta det bli och lämna som det är.

Det jag är missnöjd med är browser för vad jag än gjorde kunde jag inte få till min favicon utan det blev cordovas logga i stället.

Hur som helst är jag ändå positivt överraskad med hur väl det fungerar i emulatorn.  
Skall jag vara ärlig trodde jag att det kommer se ut som win3.1 program på en windows 10 men det blev faktiskt både snyggt, snabbt och funktionellt.

## Designprocessen

När man skall göra en mobilapp ställs man inför en rad utmaningar och man behöver ta ställning till följande:

  - vilka plattformar som skall stödjas
  - skall man ha samma funktionalitet på varje plattform
  - finns det resurser och kompetens för att skriva "native" applikationer eller
  - skall någon ramverk (vilket) användas
  - verktyg där man skriver i någon generellt språk där koden omvandlas och paketeras till olika platformar
  - man kan även köra som en mer eller mindre ren webbapplikation

Varje alternativ har sina för och nackdelar och tumregeln är att native-spåret kräver mer resurser och kompetens men samtidigt kan detaljanpassas till varje specifik plattfor.  
Å andra sidan underlättar olika ramverk app-portabilitet men samtidigt är risken att applikationerna inte blir bra på någon plattform.  
Vilken väg man än väljer bottnar det i hur duktig man är på sina verktyg och det man behöver göra.

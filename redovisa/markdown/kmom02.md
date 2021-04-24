# Kursmoment 02

Pust, jag börjar nästan hinna ikapp.  
Det här kursmomentet var jobbigt. Från början trodde jag att det skulle gå fort men sedan började saker och ting ta sin tid (om man vill göra det "ordentligt") och timmarna flöt förbi.

Jag fastnade i cache, asynkrona funktioner och callbacks och det tog mig över 10 timmar för att komma ur det. Från början tänkte jag inte använda async/await utan bara callback men till slut gav jag upp och tog med dem också.  
Ja, det var en hel del postman under felsökningen för att återställa sedan testa och upprepa.

Från början skapade jag ett helt bibliotek med olika APT-kommandon i Postman vilket har varit av stor nytta. Ju mer jag arbetar med det verktyget desto mer gillar jag det. Jag såg också att det gick att skriva java skript i det men jag har inte grävt mer.

__curl__ är en gammal kompis så det var inget speciellt nytt nu. Dessutom är det så avancerat att vi knappast skrapat på ytan. Hur som helst är det lämpligt att hämta filer från internet från cli. Man kan även använda det för att testa Restful API:er. Vill man automatisera saker går det mycket smidigare med curl jämfört med Postman.

__jq__ var helt nytt för mig och jag gillar det så länge. Om man behöver jobba mycket mer json är det nog ett väldigt bra verktyg.

## Design

Min Akilleshäl. Tur att vi redan gick igenom __SASS__ i design-kursen så det blev ändå relativt harmlöst. I detta kmom har jag faktiskt gör en hel del sass-filer utan att använda de mest avancerade funktionerna så jag är ganska nöjd med utfallet.  
Det kommer förhoppningsvis underlätta framtida arbete och eventuella ändringar.

Vad det gäller webpack är jag faktiskt väldigt nöjd att felsökningen försvåras inte av att alla js-filer klumpas ihop för rapporterade fel pekar på rätt ställe i originalfilerna.  
Med så små filer och program får man inte så mycket nytta av webpack men i ett skarpt läge kan det spara massor med resurser och göra skillnaden så att användarupplevelsen går från frustration till nirvana ;)

### Flat design

Utan att jag kunde namnet på det har jag sedan början haft aversion mot det.  
Jag gillade det inte utan att kunna sätta ord på det. Efter att jag läst de länkade artiklarna fick jag en aha-upplevelse. Det var både en rolig och nyttig läsning med en hel del detaljer fast förklart på ett klart och tydligt sätt.

Behöver väl inte säga att jag inte valt flat-design för knappen (har bara en äkta) och navigationsmenyn.  
I artikeln nämns att det också är till stor del åldersrelaterat det talar inte heller till min fördel längre.  
Knapparna och navigeringen skall likna verkligheten så mycket det går och man skall intuitivt kunna använda prylar utan att behöva spendera massa timmar med att läsa manualer och experimentera. Dessutom skall det inte finnas inlåsningseffekt.

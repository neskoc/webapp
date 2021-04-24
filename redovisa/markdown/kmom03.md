# Kursmoment 03

Japp, nu är jag ikapp.  
Det här kursmomentet var (kändes) mindre omfattande.
På grund av detta och delvis för att jag blivit varm i kläderna har det gått betydligt smidigare än föregående två.  
Jag har också fixat cache-felet efter packningen i kmom02 samt laddat upp den uppdaterade koden.

Det jag har kämpat lite med och inte fått lösning på var att jag i två vyer upprepar html-element (jag får två main inuti varandra).
Skulle uppskatta en kodgenomgång och förslag på hur jag kan fixa det.

Jag har valt att inte lägga tiden på extrauppgifter för jag börjar ligga efter i mvc och prioriterar detta.
Jag tror att ny-produkt delen skulle gå fort men autocomplete är jag osäker på hur det skulle fungera.  
Jag har också valt att inte lägga tid på videoinspelningarna för att spara tid.
Förhoppningsvis kommer jag hitta lite tid under den kommande veckan för att komma tillbaka till det.

I kmom02 fick jag kämpa med callbacks men efter en diskussion med Emil på discord tror jag att jag förstått varför jag fick problem där.
Som jag redan skrivit börjar jag känna mig varm i kläderna i synnerhet vad det gäller javascript så jag har nog mycket bättre förståelse för vad det är som skickas fram och tillbaka.  
Det har bidragit att jag kunnat fixa kmom02 väldigt snabbt.

## Mythril

Övergången till Mithril har gått ganska bra.
Jag har redan nämnt problemet med nästlade main-element men resten har fungerat bra.  
Vi har hittills bara skrapat på ytan så jag har inte hunnit med att bilda en uppfattning om jag gillar det eller inte.  
Det som är nog fördelen är att vi tvingas standardisera koden så att det blir lättare för någon utomstående att förstå hur det fungerar.

Inte relaterat till Mythril oroar jag mig lite för växande antal funktioner och hur gränssnittet skall se ut när vi har integrerat samtliga funktioner.  
Det kommer definitivt inte kunna rymmas i en rad längst ner.

## Design

Har kommer jag delvis upprepa mig lite från föregående kmom.

En bra design för formulär generellt är att det skall vara överskådligt, visuellt tilltalade, intuitivt samt med passande storlek.
Dessutom skall det följa någon sort naturligt flöde och det är relaterat till att det skall vara intuitivt.

Knapparna och navigeringen skall likna verkligheten så mycket det går och man skall intuitivt kunna använda prylar utan att behöva spendera massa timmar med att läsa manualer och experimentera.
Dessutom skall det inte finnas inlåsningseffekt.

Specifikt för mobila enheter skall det fungera för både vänsterhänta och högerhänta personer, 
för olika fingerstorlekar samt att man skall lätt kunna läsa och skriva utan att behöva använda glasögon om inte har något allvarligare synfel.  
Även färgerna skall ge stöd där grönt brukar vara ok och rött varning/fel samt att fältet visuellt byter status efter att det blivit korrekt ifyllt.

Man skall också hjälpa till genom att välja rätta filter så att man kan fylla i bara korrekta värden (nummer där det är nummer, datum där det är datum osv.).  

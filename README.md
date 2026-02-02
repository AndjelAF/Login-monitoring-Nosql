# Login Monitoring NoSQL 
Ovaj projekat predstavlja sistem za nadzor i analizu login pokušaja korisnika sa ciljem demonstracije primene različitih baza podataka u bezbednosnom scenariju.

Sistem koristi:
-Redis za operativno praćenje neuspešnih login pokušaja, privremene blokade i TTL mehanizme
-Neo4j za analizu odnosa između korisnika i IP adresa 
-Node.js + Express za backend API
-Jednostavan Admin dashboard za vizuelni prikaz podataka

Redis :
-Praćenje neuspešnih login pokušaja po korisniku i IP adresi
-Privremeno blokiranje login pokušaja
-TTL mehanizam za automatsko uklanjanje blokade
-Pregled blokiranih pokušaja kroz endpoint:
   /admin/blocked

Neo4j (analitika):
-IP adrese koje pokušavaju login za više korisnika
-Korisnici koji se loguju sa više IP adresa
-IP adrese sa velikim brojem neuspešnih login pokušaja
-Endpoint za analitiku:
   /admin/analytics

Admin dashboard:
Admin dashboard je dostupan putem browsera na adresi:
    http://localhost:3000/admin.html

Prikazuje:
-trenutno blokirane login pokušaje (Redis)
-IP adrese sa više korisnika
-korisnike koji koriste više IP adresa
-sumnjive IP adrese sa velikim brojem neuspešnih pokušaja

Sistem je testiran simulacijom različitih scenarija:
1.više korisnika sa iste IP adrese
2.jedan korisnik sa više IP adresa
3.veliki broj neuspešnih login pokušaja sa jedne IP adrese

Za testiranje su korišćeni:
1.browser (login forma)
2.Thunder Client
3.skripta koja šalje login zahteve sa različitim x-forwarded-for IP adresama

Pokretanje projekta:
1.Pokrenuti Redis i Neo4j
2.Instalirati zavisnosti:
   npm install
3.Pokrenuti server:
   node src/app.js
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import '../styles/About.css'

const About = () => {
  const { getText } = useLanguageUtils()

  return (
    <article className="about-page-container">
      <header>
        <h1 className="about-title">{getText("Tietoa","About")}</h1>
      </header>
      
      <div className="about-content-container">
        <section>
          <h2>{getText("Tietoa meistä","About Us")}</h2>
          <p>{getText("Tervetuloa MovieCritic-sivustolle, joka on elokuvien ystävien ykköskohde! Olitpa intohimoinen elokuvan harrastaja, satunnainen katselija tai vain etsimässä seuraavaa upeaa elokuvaa, meillä on kaikki, mitä tarvitset.", 
          `Welcome to MovieCritic, your ultimate destination for exploring and sharing a love for movies! 
            Whether you're a passionate movie enthuasist, a casual viewer, or just someone looking for the next great film to watch, we've got you covered.`)}</p>
            <p>{getText("Sivustomme on rakennettu yhdistämään elokuvien ystävät ja tarjoamaan kattavat resurssit elokuvien löytämiseen, arvosteluun ja niistä keskustelemiseen.",
              "Our platform is built to connect movie enthusiasts and provide in-depth resources to discover, review, and discuss films.")}</p>
        </section>
        <section>
          <h2>{getText("Mitä tarjoamme","What We Offer")}</h2>
          <h3>{getText("Laaja elokuvatietokanta:","Massive Movie Database:")}</h3>
          <p>{getText("Selaa laajaa kirjastoa, joka sisältää yli 10 000 elokuvaa! Klassikoista uusimpiin hitteihin olemme koonneet valikoiman, joka sopii kaikkiin makuihin.",
            `Browse through our extensive library of over 10,000 movies! From timeless classics to the latest blockbusters, we've curated a comprehensive collection to cater to all tastes.`)}</p>
          <h3>{getText("Loputon ja saumaton selailu:","Endless and Seamless Browsing:")}</h3>
          <p>{getText("Selaa laajaa elokuvakokoelmaamme loputtomalla selauksella. Kun vierität alaspäin, uusia elokuvia ladataan jatkuvasti, mikä tarjoaa saumattoman selauskokemuksen ja mahdollisuuden löytää piilotettuja helmiä kattavasta kirjastostamme.",
            "Explore our vast movie collection with infinite scrolling. As you scroll, new movies are continuously loaded, offering a seamless browsing experience and a chance to discover hidden gems in our extensive library.")}</p>
          <h3>{getText("Yksityiskohtaiset elokuvasivut:","Detailed Movie Pages:")}</h3>
          <p>{getText("Tutustu elokuviin syvällisesti yksityiskohtaisten sivujen avulla, jotka sisältävät tietoa näyttelijöistä, ohjaajista, genreistä, juonitiivistelmistä ja paljon muuta.",
            "Dive deep into each movie with our detailed pages, featuring information on cast, crew, genres, plot summaries, and much more.")}</p>
          <h3>{getText("Yhteisön kirjoittamat arvostelut:","Community-Powered Reviews:")}</h3>
          <p>{getText("Jäsenemme ovat sivustomme sydän. Jokaiselta elokuvasivulta löydät aitoja arvosteluja yhteisöltämme, jotka tarjoavat näkemyksiä ja mielipiteitä kaltaisiltasi elokuvien ystäviltä.",
            "Our members are at the heart of the platform. Each movie page features authentic reviews from our community, giving you insights and perspectives from real movie lovers like you.")}</p>
          <h3>{getText("Interaktiiviset ominaisuudet:","Interactive Features:")}</h3>
          <p>{getText("Äänestä arvosteluja: Nosta parhaat arvostelut esiin äänestämällä niitä.",
            "Upvote Reviews: Help highlight the best reviews by upvoting your favorites.")}</p>
          <p>{getText("Jäsenpanokset: Lisää uusia elokuvia tietokantaan tai kirjoita arvosteluja elokuville!",
            "Member Contributions: Add movies to the database or add reviews to movies!")}</p>
          <p>{getText("Henkilökohtaiset profiilit: Näytä kaikki kirjoittamasi arvostelut ja lisäämäsi elokuvat omalla profiilisivullasi.",
            `Personalized Profiles: Showcase all the reviews you've written and the movies you've contributed to on your profile.`)}</p>
          <h3>{getText("Älykäs haku ja suodatus:","Smart Search and Filters:")}</h3>
          <p>{getText("Löydä täydellinen elokuva hakemalla nimellä tai käyttämällä lajityyppi valitsinta.",
            "Find the perfect movie by searching by name or filtering by genre.")}</p>
          <h3>{getText("Monikielinen kokemus:","Multilingual Experience:")}</h3>
          <p>{getText("Käytä sivustoamme suomeksi tai englanniksi helppokäyttöisen kielivalitsimen avulla.",
            "Enjoy our platform in both Finnish and English with a simple language selector.")}</p>
        </section>
        
        <section>
          <h2>{getText("Lähteet ja kiitokset","Attributions")}</h2>
              <p>{getText("Kuvakkeet tarjoaa","Icons provided by")} <a className="attribution-link" href="https://lucide.dev">Lucide</a></p>
              <p>{getText("Elokuvatiedot tarjoaa","Movie data provided by")} <a className="attribution-link" href="https://www.themoviedb.org">TMDB</a></p>
              <p>{getText("Taustakuvan tarjoaa","Background image provided by")} <a className="attribution-link" href="https://www.mihoyo.com/en/?page=about">miHoYo</a></p>
        </section>
      </div>
    </article>
  )
}

export default About

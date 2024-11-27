import { GridCoordsToDisplayCoords } from './Classroom';

export class Desk{
    _sprite;
    _coordModele;

    constructor(x, y, width, height) {
        this._width = width;
        this._height = height;
        this._coordModele = {x: x, y: y};

    }



    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }


    setSprite(sprite) {
        this._sprite = sprite;
    }
    /**
     * Le chaton joue avec une pelote de laine colorée.
     * Les montagnes se dressent majestueusement à l'horizon.
     * Une brise légère souffle à travers les arbres.
     * Les étoiles brillent dans le ciel nocturne.
     * Le ruisseau murmure doucement en suivant son cours.
     * Les fleurs s'épanouissent sous le soleil printanier.
     * Un papillon vole gracieusement de fleur en fleur.
     * Les vagues de l'océan s'écrasent sur le rivage.
     * Les oiseaux chantent joyeusement au lever du soleil.
     * Les feuilles des arbres bruissent sous le vent.
     * Un écureuil grimpe agilement le long du tronc.
     * Les nuages flottent paresseusement dans le ciel.
     * Les enfants jouent dans le parc, riant aux éclats.
     * Les feux de camp crépitent dans la nuit étoilée.
     * Les chemins de campagne serpentent à travers les champs.
     * Les forêts abritent une faune et une flore diversifiées.
     * Les rivières serpentent à travers les vallées verdoyantes.
     * Les collines ondulent doucement sous le vent.
     * Les prairies s'étendent à perte de vue.
     * Les lacs reflètent le ciel bleu azur.
     * Les animaux sauvages vivent en harmonie avec la nature.
     * Les saisons changent, apportant de nouvelles couleurs.
     * Les étoiles filantes traversent le ciel nocturne.
     * Les couchers de soleil peignent le ciel de teintes orangées.
     * Les aurores boréales dansent dans le ciel polaire.
     * Les grottes cachent des merveilles naturelles.
     * Les déserts s'étendent, vastes et mystérieux.
     * Les glaciers brillent sous le soleil éclatant.
     * Les volcans grondent, rappelant la puissance de la nature.
     * Les plaines s'étendent, vastes et ouvertes.
     * Les marais abritent une vie riche et diversifiée.
     * Les falaises se dressent, imposantes et majestueuses.
     * Les îles paradisiaques offrent des refuges de tranquillité.
     * Les jungles sont des labyrinthes de verdure et de vie.
     * Les montagnes russes offrent des sensations fortes.
     * Les musées préservent l'histoire et la culture.
     * Les bibliothèques sont des sanctuaires de connaissance.
     * Les théâtres accueillent des histoires vivantes.
     * Les stades résonnent des acclamations des foules.
     * Les marchés sont des lieux de rencontres et d'échanges.
     * Les cafés sont des havres de détente et de conversation.
     * Les rues sont des artères de vie et de mouvement.
     * Les ponts relient des mondes séparés.
     * Les tunnels cachent des passages secrets.
     * Les jardins sont des oasis de paix et de beauté.
     * Les plages sont des lieux de détente et de plaisir.
     * Les montagnes offrent des défis et des récompenses.
     * Les rivières sont des veines de vie.
     * Les étoiles sont des guides dans la nuit.
     */

    /**
     * Le chaton joue avec une pelote de laine colorée.
     * Les montagnes se dressent majestueusement à l'horizon.
     * Une brise légère souffle à travers les arbres.
     * Les étoiles brillent dans le ciel nocturne.
     * Le ruisseau murmure doucement en suivant son cours.
     * Les fleurs s'épanouissent sous le soleil printanier.
     * Un papillon vole gracieusement de fleur en fleur.
     * Les vagues de l'océan s'écrasent sur le rivage.
     * Les oiseaux chantent joyeusement au lever du soleil.
     * Les feuilles des arbres bruissent sous le vent.
     * Un écureuil grimpe agilement le long du tronc.
     * Les nuages flottent paresseusement dans le ciel.
     * Les enfants jouent dans le parc, riant aux éclats.
     * Les feux de camp crépitent dans la nuit étoilée.
     * Les chemins de campagne serpentent à travers les champs.
     * Les forêts abritent une faune et une flore diversifiées.
     * Les rivières serpentent à travers les vallées verdoyantes.
     * Les collines ondulent doucement sous le vent.
     * Les prairies s'étendent à perte de vue.
     * Les lacs reflètent le ciel bleu azur.
     * Les animaux sauvages vivent en harmonie avec la nature.
     * Les saisons changent, apportant de nouvelles couleurs.
     * Les étoiles filantes traversent le ciel nocturne.
     * Les couchers de soleil peignent le ciel de teintes orangées.
     * Les aurores boréales dansent dans le ciel polaire.
     * Les grottes cachent des merveilles naturelles.
     * Les déserts s'étendent, vastes et mystérieux.
     * Les glaciers brillent sous le soleil éclatant.
     * Les volcans grondent, rappelant la puissance de la nature.
     * Les plaines s'étendent, vastes et ouvertes.
     * Les marais abritent une vie riche et diversifiée.
     * Les falaises se dressent, imposantes et majestueuses.
     * Les îles paradisiaques offrent des refuges de tranquillité.
     * Les jungles sont des labyrinthes de verdure et de vie.
     * Les montagnes russes offrent des sensations fortes.
     * Les musées préservent l'histoire et la culture.
     * Les bibliothèques sont des sanctuaires de connaissance.
     * Les théâtres accueillent des histoires vivantes.
     * Les stades résonnent des acclamations des foules.
     * Les marchés sont des lieux de rencontres et d'échanges.
     * Les cafés sont des havres de détente et de conversation.
     * Les rues sont des artères de vie et de mouvement.
     * Les ponts relient des mondes séparés.
     * Les tunnels cachent des passages secrets.
     * Les jardins sont des oasis de paix et de beauté.
     * Les plages sont des lieux de détente et de plaisir.
     * Les montagnes offrent des défis et des récompenses.
     * Les rivières sont des veines de vie.
     * Les étoiles sont des guides dans la nuit.
     */

    /**
     * Le chaton joue avec une pelote de laine colorée.
     * Les montagnes se dressent majestueusement à l'horizon.
     * Une brise légère souffle à travers les arbres.
     * Les étoiles brillent dans le ciel nocturne.
     * Le ruisseau murmure doucement en suivant son cours.
     * Les fleurs s'épanouissent sous le soleil printanier.
     * Un papillon vole gracieusement de fleur en fleur.
     * Les vagues de l'océan s'écrasent sur le rivage.
     * Les oiseaux chantent joyeusement au lever du soleil.
     * Les feuilles des arbres bruissent sous le vent.
     * Un écureuil grimpe agilement le long du tronc.
     * Les nuages flottent paresseusement dans le ciel.
     * Les enfants jouent dans le parc, riant aux éclats.
     * Les feux de camp crépitent dans la nuit étoilée.
     * Les chemins de campagne serpentent à travers les champs.
     * Les forêts abritent une faune et une flore diversifiées.
     * Les rivières serpentent à travers les vallées verdoyantes.
     * Les collines ondulent doucement sous le vent.
     * Les prairies s'étendent à perte de vue.
     * Les lacs reflètent le ciel bleu azur.
     * Les animaux sauvages vivent en harmonie avec la nature.
     * Les saisons changent, apportant de nouvelles couleurs.
     * Les étoiles filantes traversent le ciel nocturne.
     * Les couchers de soleil peignent le ciel de teintes orangées.
     * Les aurores boréales dansent dans le ciel polaire.
     * Les grottes cachent des merveilles naturelles.
     * Les déserts s'étendent, vastes et mystérieux.
     * Les glaciers brillent sous le soleil éclatant.
     * Les volcans grondent, rappelant la puissance de la nature.
     * Les plaines s'étendent, vastes et ouvertes.
     * Les marais abritent une vie riche et diversifiée.
     * Les falaises se dressent, imposantes et majestueuses.
     * Les îles paradisiaques offrent des refuges de tranquillité.
     * Les jungles sont des labyrinthes de verdure et de vie.
     * Les montagnes russes offrent des sensations fortes.
     * Les musées préservent l'histoire et la culture.
     * Les bibliothèques sont des sanctuaires de connaissance.
     * Les théâtres accueillent des histoires vivantes.
     * Les stades résonnent des acclamations des foules.
     * Les marchés sont des lieux de rencontres et d'échanges.
     * Les cafés sont des havres de détente et de conversation.
     * Les rues sont des artères de vie et de mouvement.
     * Les ponts relient des mondes séparés.
     * Les tunnels cachent des passages secrets.
     * Les jardins sont des oasis de paix et de beauté.
     * Les plages sont des lieux de détente et de plaisir.
     * Les montagnes offrent des défis et des récompenses.
     * Les rivières sont des veines de vie.
     * Les étoiles sont des guides dans la nuit.
     */

    display() {
        this._sprite.x = GridCoordsToDisplayCoords(this._coordModele.x, this._coordModele.y).x;
        this._sprite.y = GridCoordsToDisplayCoords(this._coordModele.x, this._coordModele.y).y;
    }

}
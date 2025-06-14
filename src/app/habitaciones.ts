import { Habitacion } from "./habitacion";

export const Habitaciones:Habitacion[]=[
    {
        tipo: "Cabaña Sencilla",
        costo: 1200,
        noRecamaras: 1,
        noCamas: 1,
        tipoCama: "Matrimonial",
        noPersonas: "1 a 2",
        noBanos: 1,
        descripcion: "Cabaña sencilla, ideal para una o dos personas. Equipada con una cama matrimonial, baño privado y ambiente acogedor para descansar.",
        pathImg: "habs/cab1.png",
        galeria:["habs/cab1.png", "habs/cabSencilla.png", "habs/cocina.png", "habs/sala.png", "habs/baño.png"]
    },
    {
        tipo: "Cabaña Doble",
        costo: 2000,
        noRecamaras: 2,
        noCamas: 2,
        tipoCama: "Matrimonial",
        noPersonas: "2 a 4",
        noBanos: 1,
        descripcion: "Cabaña doble con dos recámaras, cada una con una cama matrimonial. Perfecta para familias pequeñas o grupos de hasta cuatro personas.",
        pathImg: "habs/cab2.png",
        galeria:["habs/cab2.png", "habs/cabDoble.png", "habs/cocina.png", "habs/sala.png", "habs/baño.png"]
    },
    {
        tipo: "Cabaña Triple",
        costo: 3500,
        noRecamaras: 1,
        noCamas: 3,
        tipoCama: "Individual",
        noPersonas: "para 3",
        noBanos: 1,
        descripcion: "Cabaña triple con una recámara equipada con tres camas individuales. Ideal para grupos pequeños o amigos que desean compartir espacio.",
        pathImg: "habs/cab3.png",
        galeria:["habs/cab3.png", "habs/cabTriple.png", "habs/cocina.png", "habs/sala.png", "habs/baño.png"]
    },
    {
        tipo: "Cabaña Familiar",
        costo: 4000,
        noRecamaras: 2,
        noCamas: 4,
        tipoCama: "Matrimonial",
        noPersonas: "4 a 8",
        noBanos: 2,
        descripcion: "Cabaña familiar con dos recámaras, cada una con dos camas matrimoniales. Espaciosa y cómoda, ideal para grupos grandes o familias numerosas.",
        pathImg: "habs/cab4.png",
        galeria:["habs/cab4.png", "habs/cabFam.png", "habs/cocina.png", "habs/sala.png", "habs/baño.png"]
    }
];
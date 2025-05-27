import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Destino {
  nombre: string;
  descripcion: string;
  actividades: string[];
  imagen: string;
}

const ciudades: Destino[]=[
  {
    "nombre": "Zermatt",
    "descripcion": "Famosa por el Matterhorn y actividades de montaña.",
    "actividades": ["Esquí", "Senderismo", "Escalada", "Fotografía"],
    "imagen": "https://www.signatureluxurytravel.com.au/wp-content/uploads/2024/05/0.STMS23_Keyvisual_edit_LR.jpg"
  },
  {
    "nombre": "Interlaken",
    "descripcion": "Destinada a deportes extremos con vistas espectaculares.",
    "actividades": ["Parapente", "Rafting", "Senderismo", "Paseos en barco"],
    "imagen": "https://img2.oastatic.com/img2/72509643/max/variant.jpg"
  },
  {
    "nombre": "Lucerna",
    "descripcion": "Conocida por su puente cubierto medieval y actividades junto al lago.",
    "actividades": ["Museos", "Cruceros", "Caminatas", "Paseos en barco"],
    "imagen": "https://www.civitatis.com/f/suiza/lucerna/tour-privado-lucerna-589x392.jpg"
  },
  {
    "nombre": "St. Moritz",
    "descripcion": "Un destino de lujo para deportes invernales y eventos exclusivos.",
    "actividades": ["Esquí", "Snowboard", "Cultura", "Spa"],
    "imagen": "https://www.momondo.mx/himg/1b/8b/3f/leonardo-1130515-Carlton_Hotel_St._Moritz_(8)_O-341893.jpg"
  },
  {
    "nombre": "Lauterbrunnen",
    "descripcion": "Conocida por sus impresionantes cascadas y montañas.",
    "actividades": ["Senderismo", "Escalada", "Visitas a cascadas", "Trenes de montaña"],
    "imagen": "https://images.interhome.group/travelguide/switzerland-lauterbrunnen-village-berner-oberland.jpg"
  },
  {
    "nombre": "Grindelwald",
    "descripcion": "Pueblo alpino ideal para deportes de aventura.",
    "actividades": ["Senderismo", "Escalada", "Esquí", "Bicicross"],
    "imagen": "https://www.montagnaestate.it/wp-content/uploads/Grindelwald-estate-890x593.jpg"
  },
  {
    "nombre": "Davos",
    "descripcion": "Famoso por su conferencia y actividades al aire libre.",
    "actividades": ["Esquí", "Senderismo", "Snowboard", "Cultura"],
    "imagen": "https://assets.weforum.org/article/image/uJOD1Qv45qzd_6lWsqLePPMfQcXi9o9vUqze4Lg77Ok.jpg"
  },
  {
    "nombre": "Gstaad",
    "descripcion": "Destino exclusivo para turismo de lujo y deportes de invierno.",
    "actividades": ["Esquí", "Snowboard", "Compras", "Restaurantes de lujo"],
    "imagen": "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/122000/122245-Bernese-Alps-Area.jpg"
  },
  {
    "nombre": "Engelberg",
    "descripcion": "Famoso por el monasterio y deportes alpinos.",
    "actividades": ["Esquí", "Senderismo", "Escalada", "Visitas culturales"],
    "imagen": "https://images.interhome.group/travelguide/switzerland-engelberg.jpg"
  },
  {
    "nombre": "Saas-Fee",
    "descripcion": "Aldea alpina rodeada por glaciares, ideal para esquiar todo el año.",
    "actividades": ["Esquí de verano", "Alpinismo", "Senderismo", "Trineos"],
    "imagen": "https://www.lugaresdenieve.com/sites/default/files/imagenes-reportajes/saas-fee-dos.jpg"
  },
  {
    "nombre": "Zurich",
    "descripcion": "Ciudad vibrante famosa por su lago y vida nocturna.",
    "actividades": ["Cultura", "Compras", "Museos", "Vida nocturna"],
    "imagen": "https://img.static-kl.com/images/media/506F5E1C-28C1-4555-A238CB9D4AD6039E"
  },
  {
    "nombre": "Geneva",
    "descripcion": "Ciudad conocida por el lago de Ginebra y las organizaciones internacionales.",
    "actividades": ["Cultura", "Museos", "Lago", "Compras"],
    "imagen": "https://www.geneve.com/fileadmin/_processed_/7/9/csm_nuit_2200px_6df6b192da.webp"
  },
  {
    "nombre": "Basel",
    "descripcion": "Ciudad de arte y cultura con una arquitectura moderna impresionante.",
    "actividades": ["Museos", "Exposiciones", "Paseos por el río", "Gastronomía"],
    "imagen": "https://image-service.web.oebb.at/pv/.imaging/default/dam/nightjet/hero-header/header-overlay-1422x800/laender-und-staedte-1422x800/basel-panorama.jpg/jcr:content.jpg?t=1623749738489&scale=1.0"
  },
  {
    "nombre": "Bern",
    "descripcion": "La capital de Suiza, con un casco histórico increíblemente bien conservado.",
    "actividades": ["Museos", "Tour histórico", "Senderismo", "Cerveza artesanal"],
    "imagen": "https://media.istockphoto.com/id/475439326/es/foto/bern.jpg?s=612x612&w=0&k=20&c=dPHPUmIJ8-Vxd35i_KaA9ne3KpfmIX5uTAtcPB8kqIk="
  },
  {
    "nombre": "Lausanne",
    "descripcion": "Famosa por su Museo Olímpico y su arquitectura moderna.",
    "actividades": ["Museos", "Senderismo", "Paseos en barco", "Cultura"],
    "imagen": "https://imageio.forbes.com/specials-images/imageserve/65f96030c4ea8599127feef4/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
  },
  {
    "nombre": "Thun",
    "descripcion": "Hermosa ciudad en el Lago de Thun con un pintoresco casco antiguo.",
    "actividades": ["Castillo de Thun", "Paseos en bote", "Senderismo", "Pesca"],
    "imagen": "https://media.myswitzerland.com/image/fetch/c_lfill,g_auto,w_3200,h_1800/f_auto,q_80,fl_keep_iptc/https://www.myswitzerland.com/-/media/dam/resources/places/l/a/lake%20thun%20region/images%20summer/49552_32001800.jpeg"
  },
  {
    "nombre": "Lugano",
    "descripcion": "Ciudad ubicada junto al Lago de Lugano, con un clima mediterráneo.",
    "actividades": ["Caminatas", "Compras", "Paseos por el lago", "Excursiones"],
    "imagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/72/a9/e7/lugano.jpg?w=1000&h=600&s=1"
  },
  {
    "nombre": "Montreux",
    "descripcion": "Famosa por su festival de jazz y su ubicación junto al Lago de Ginebra.",
    "actividades": ["Festival de Jazz", "Paseos en barco", "Senderismo", "Cultura"],
    "imagen": "https://mediaim.expedia.com/destination/1/37348f25cd74e524cc4b2c69beb9ebf8.jpg"
  },
  {
    "nombre": "Appenzell",
    "descripcion": "Ciudad tradicional con arquitectura pintoresca y montañas para explorar.",
    "actividades": ["Senderismo", "Cultura suiza", "Gastronomía", "Visitas históricas"],
    "imagen": "https://img2.oastatic.com/img2/65307203/max/variant.jpg"
  }
];

@Injectable({
  providedIn: 'root'
})
export class DestinosService {
  private apiUrl = 'https://destinosuizza.free.beeceptor.com/todos';

  constructor(private http: HttpClient) {}

  // obtenerDestinos(): Observable<Destino[]> {
  //   return this.http.get<Destino[]>(this.apiUrl);
  // }

  obtenerDestinos(): Observable<Destino[]> {
    // Simula una llamada HTTP pero devuelve los datos locales
    return of(ciudades);
  }
}
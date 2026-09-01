import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Producto } from '../model/producto.model';
import { Categoria } from '../model/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = 'http://localhost:5139/ProductoService.svc';

  constructor(private http: HttpClient) {}


  // ============================================
  // OBTENER TODOS LOS PRODUCTOS
  // ============================================
  obtenerProductos(): Observable<Producto[]> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">

        <soap:Header/>

        <soap:Body>
          <tem:ObtenerProductos/>
        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/ObtenerProductos"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    ).pipe(
      map(response =>
        this.convertirXmlAProductos(response)
      )
    );
  }


  // ============================================
  // OBTENER TODAS LAS CATEGORIAS
  // ============================================
  obtenerCategorias(): Observable<Categoria[]> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">

        <soap:Header/>

        <soap:Body>
          <tem:ObtenerCategorias/>
        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/ObtenerCategorias"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    ).pipe(
      map(response =>
        this.convertirXmlACategorias(response)
      )
    );
  }


  // ============================================
  // OBTENER PRODUCTO POR ID
  // ============================================
  obtenerProducto(
    id: number
  ): Observable<Producto | null> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">

        <soap:Header/>

        <soap:Body>

          <tem:ObtenerProducto>

            <tem:id>${id}</tem:id>

          </tem:ObtenerProducto>

        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/ObtenerProducto"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    ).pipe(
      map(response =>
        this.convertirXmlAProducto(response)
      )
    );
  }


  // ============================================
  // AGREGAR PRODUCTO
  // ============================================
  agregarProducto(
    producto: Producto
  ): Observable<string> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/"
        xmlns:pro="http://schemas.datacontract.org/2004/07/ProductosSOAPA.Models">

        <soap:Header/>

        <soap:Body>

          <tem:AgregarProducto>

            <tem:producto>

              <pro:Descripcion>${this.escaparXml(
                producto.descripcion ?? ''
              )}</pro:Descripcion>

              <pro:Estado>${producto.estado}</pro:Estado>

              <pro:IdCategoria>${producto.idCategoria}</pro:IdCategoria>

              <pro:IdProducto>0</pro:IdProducto>

              <pro:Nombre>${this.escaparXml(
                producto.nombre
              )}</pro:Nombre>

              <pro:Precio>${producto.precio}</pro:Precio>

              <pro:Stock>${producto.stock}</pro:Stock>

            </tem:producto>

          </tem:AgregarProducto>

        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/AgregarProducto"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    );
  }


  // ============================================
  // ACTUALIZAR PRODUCTO
  // ============================================
  actualizarProducto(
    producto: Producto
  ): Observable<string> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/"
        xmlns:pro="http://schemas.datacontract.org/2004/07/ProductosSOAPA.Models">

        <soap:Header/>

        <soap:Body>

          <tem:ActualizarProducto>

            <tem:producto>

              <pro:Descripcion>${this.escaparXml(
                producto.descripcion ?? ''
              )}</pro:Descripcion>

              <pro:Estado>${producto.estado}</pro:Estado>

              <pro:IdCategoria>${producto.idCategoria}</pro:IdCategoria>

              <pro:IdProducto>${producto.idProducto}</pro:IdProducto>

              <pro:Nombre>${this.escaparXml(
                producto.nombre
              )}</pro:Nombre>

              <pro:Precio>${producto.precio}</pro:Precio>

              <pro:Stock>${producto.stock}</pro:Stock>

            </tem:producto>

          </tem:ActualizarProducto>

        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/ActualizarProducto"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    );
  }


  // ============================================
  // ELIMINAR PRODUCTO
  // ============================================
  eliminarProducto(
    id: number
  ): Observable<string> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">

        <soap:Header/>

        <soap:Body>

          <tem:EliminarProducto>

            <tem:id>${id}</tem:id>

          </tem:EliminarProducto>

        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/EliminarProducto"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    );
  }


  // ============================================
  // OBTENER PRODUCTOS POR PRECIO
  // ============================================
  obtenerProductosPorPrecio(
    precioMinimo: number,
    precioMaximo: number
  ): Observable<Producto[]> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">

        <soap:Header/>

        <soap:Body>

          <tem:ObtenerProductosPorPrecio>

            <tem:precioMinimo>${precioMinimo}</tem:precioMinimo>

            <tem:precioMaximo>${precioMaximo}</tem:precioMaximo>

          </tem:ObtenerProductosPorPrecio>

        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/ObtenerProductosPorPrecio"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    ).pipe(
      map(response =>
        this.convertirXmlAProductos(response)
      )
    );
  }


  // ============================================
  // OBTENER PRODUCTOS POR CATEGORIA
  // ============================================
  obtenerProductosPorCategoria(
    idCategoria: number
  ): Observable<Producto[]> {

    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>

      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">

        <soap:Header/>

        <soap:Body>

          <tem:ObtenerProductosPorCategoria>

            <tem:idCategoria>${idCategoria}</tem:idCategoria>

          </tem:ObtenerProductosPorCategoria>

        </soap:Body>

      </soap:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        '"http://tempuri.org/IProductoService/ObtenerProductosPorCategoria"'
    });

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: headers,
        responseType: 'text'
      }
    ).pipe(
      map(response =>
        this.convertirXmlAProductos(response)
      )
    );
  }


  // ============================================
  // CONVERTIR SOAP A UN SOLO PRODUCTO
  // ============================================
  private convertirXmlAProducto(
    xml: string
  ): Producto | null {

    const parser =
      new DOMParser();

    const xmlDoc =
      parser.parseFromString(
        xml,
        'text/xml'
      );

    const resultado =
      xmlDoc.getElementsByTagNameNS(
        '*',
        'ObtenerProductoResult'
      )[0];

    if (!resultado) {
      return null;
    }


    // ==========================================
    // VERIFICAR SI SOAP DEVOLVIO NULL
    // ==========================================
    const nil =
      resultado.getAttributeNS(
        'http://www.w3.org/2001/XMLSchema-instance',
        'nil'
      );

    if (nil === 'true') {
      return null;
    }


    // ==========================================
    // OBTENER CAMPOS DEL PRODUCTO
    // ==========================================
    const obtenerTexto = (
      nombre: string
    ): string => {

      return resultado
        .getElementsByTagNameNS(
          '*',
          nombre
        )[0]
        ?.textContent ?? '';
    };


    const idProducto =
      Number(
        obtenerTexto('IdProducto')
      );

    if (idProducto <= 0) {
      return null;
    }


    const producto: Producto = {

      idProducto:
        idProducto,

      nombre:
        obtenerTexto('Nombre'),

      descripcion:
        obtenerTexto('Descripcion') ||
        null,

      precio:
        Number(
          obtenerTexto('Precio')
        ),

      stock:
        Number(
          obtenerTexto('Stock')
        ),

      estado:
        obtenerTexto('Estado')
          .toLowerCase() === 'true',

      idCategoria:
        Number(
          obtenerTexto('IdCategoria')
        )
    };

    return producto;
  }


  // ============================================
  // CONVERTIR SOAP A LISTA DE PRODUCTOS
  // ============================================
  private convertirXmlAProductos(
    xml: string
  ): Producto[] {

    const parser =
      new DOMParser();

    const xmlDoc =
      parser.parseFromString(
        xml,
        'text/xml'
      );

    const nodosProductos =
      xmlDoc.getElementsByTagNameNS(
        '*',
        'Producto'
      );

    const productos: Producto[] = [];

    for (
      let i = 0;
      i < nodosProductos.length;
      i++
    ) {

      const nodo =
        nodosProductos[i];

      const obtenerTexto = (
        nombre: string
      ): string => {

        return nodo
          .getElementsByTagNameNS(
            '*',
            nombre
          )[0]
          ?.textContent ?? '';
      };


      const producto: Producto = {

        idProducto:
          Number(
            obtenerTexto('IdProducto')
          ),

        nombre:
          obtenerTexto('Nombre'),

        descripcion:
          obtenerTexto('Descripcion') ||
          null,

        precio:
          Number(
            obtenerTexto('Precio')
          ),

        stock:
          Number(
            obtenerTexto('Stock')
          ),

        estado:
          obtenerTexto('Estado')
            .toLowerCase() === 'true',

        idCategoria:
          Number(
            obtenerTexto('IdCategoria')
          )
      };

      productos.push(producto);
    }

    return productos;
  }


  // ============================================
  // CONVERTIR SOAP A CATEGORIAS
  // ============================================
  private convertirXmlACategorias(
    xml: string
  ): Categoria[] {

    const parser =
      new DOMParser();

    const xmlDoc =
      parser.parseFromString(
        xml,
        'text/xml'
      );

    const nodosCategorias =
      xmlDoc.getElementsByTagNameNS(
        '*',
        'Categoria'
      );

    const categorias: Categoria[] = [];

    for (
      let i = 0;
      i < nodosCategorias.length;
      i++
    ) {

      const nodo =
        nodosCategorias[i];

      const obtenerTexto = (
        nombre: string
      ): string => {

        return nodo
          .getElementsByTagNameNS(
            '*',
            nombre
          )[0]
          ?.textContent ?? '';
      };


      const categoria: Categoria = {

        idCategoria:
          Number(
            obtenerTexto(
              'IdCategoria'
            )
          ),

        nombre:
          obtenerTexto('Nombre'),

        descripcion:
          obtenerTexto(
            'Descripcion'
          ) || null,

        estado:
          obtenerTexto('Estado')
            .toLowerCase() === 'true'
      };

      categorias.push(
        categoria
      );
    }

    return categorias;
  }


  // ============================================
  // ESCAPAR CARACTERES ESPECIALES XML
  // ============================================
  private escaparXml(
    valor: string
  ): string {

    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
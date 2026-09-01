import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimientoInventario } from '../model/movimiento-inventario';

@Injectable({
  providedIn: 'root'
})
export class MovimientoInventarioService {

  private apiUrl =
    'http://localhost:5139/api/MovimientoInventario';

  constructor(private http: HttpClient) { }

  // GET - Obtener todos
  obtenerMovimientos(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(
      this.apiUrl
    );
  }

  // GET POR ID
  obtenerMovimientoPorId(
    id: number
  ): Observable<MovimientoInventario> {
    return this.http.get<MovimientoInventario>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST
  agregarMovimiento(
    movimiento: MovimientoInventario
  ): Observable<MovimientoInventario> {
    return this.http.post<MovimientoInventario>(
      this.apiUrl,
      movimiento
    );
  }

  // PUT
  actualizarMovimiento(
    id: number,
    movimiento: MovimientoInventario
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      movimiento
    );
  }

  // DELETE
  eliminarMovimiento(
    id: number
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}
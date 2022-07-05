import { HttpClient } from "@angular/common/http";
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';

/// Private methods
export function  getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body as T;

        /// check if Pagination header is present
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') as string);
        }
        return paginatedResult;
      })
    );
  }

  export function  getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());

      return params;
  }
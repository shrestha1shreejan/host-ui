import { AccountService } from "./account.service";
import { UserParams } from "./../_models/userParams";
import { PaginatedResult } from "./../_models/pagination";
import { Member } from "./../_models/member";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { map, of, take } from "rxjs";
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams:UserParams;

  constructor(private http: HttpClient, private accountService: AccountService){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user as User;
        this.userParams = new UserParams(user as User);
      }
    })
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  // with caching example
  // getMembers() {
  //   if(this.members.length > 0) {
  //     return of(this.members);
  //   }
  //   // using pipe to cache members data
  //   return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
  //     map(members => {
  //       this.members = members;
  //       return members;
  //     })
  //   );
  // }

  /**
   *  adding the pagination to the get Members
   */
  getMembers(userParams: UserParams) {
   // console.log(Object.values(userParams).join('-'));
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) {
      return of(response);
    }
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    // using pipe to cache members data
    return this.getPaginatedResult<Member[]>(this.baseUrl, params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }  

  getMember(username: string) {
    const member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result), [])
    .find((member: Member) => member.username === username);

    if (member) {
      return of(member);
    }
    console.log(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      }) 
    );
  }

  setMainPhoto(phototId: number) {
   return this.http.put(this.baseUrl + 'users/set-main-photo/' + phototId, {});
  }

  deletePhoto(phototId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + phototId, {});
   }


   /// Private methods
   private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url + 'users', { observe: 'response', params }).pipe(
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

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());

      return params;
  }
}

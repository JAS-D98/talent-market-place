export interface FundiApplication {
  serviceId: string;
    hourlyRate: number | null;
    locationId?: string | null;
    documents?: string[] | null;
}


export interface FundiApplicationResponse {
  success: boolean;
  message: string;
  data?: FundiApplication;
}

export interface CreateFundiApplicationDto {
    message: string;
    success: boolean;
}

export interface GetFundiProfileReDto {
    success: boolean;
    message: string;
    data?: FundiApplication;
}

export interface FundiWithRelations extends FundiApplication {
    user: any;
    service: any;
    location: any;
}

export interface GetPendingFundiProfilesResponse {
    success: boolean;
    data?: FundiWithRelations[];
}

export interface GetAllFundiProfilesResponse {
    success: boolean;
    data?: FundiWithRelations[];
}
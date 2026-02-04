export interface addServiceResponse {
    message: string;
    success: boolean;
}

export interface updateServiceResponse {
    message: string;
    success: boolean;
}

export interface Service {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface getServicesResponse {
    success: boolean;
    data: Service[];
}

export interface getServiceByIdResponse {
    success: boolean;
    data: Service;
}

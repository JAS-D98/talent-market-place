export interface Location {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LocationResponse {
    success: boolean;
    message: string;
}

export interface LocationsResponse {
    success: boolean;
    data: Location[];
}

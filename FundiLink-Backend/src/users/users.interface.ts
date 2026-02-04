export interface SignUpResponse {
    message: string;
    success: boolean;
}

export interface SignInResponse {
    message: string;
    accessToken: string;
    user: {
        id: String;
        email: string;
        name: string;
        phone: string;
        isVerified?: string; // Optional field for verification status
        role?: string;
    };
}

export interface SignOutResponse {
    message: string;
}
export interface IRequestResponse<T> {
    success: boolean;
    message: string;
    data: Array<T>;
    pagesNumber?: number;
}
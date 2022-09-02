export interface UserRequestDto {
    username: string
    password: string
}

export interface UserResponseDto {
    id: number
    username: string
    createdAt: number
    updatedAt: number
}

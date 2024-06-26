
export type User = {
    id: number
    username: string | null
    employee_id: string | null
    email: string | null
    location: string | null
    phone_number: string | null
    role: string | null
    user_level: string | null
}

export type UserContainerType = {
    [key: number]: User | null;
  };

export type NewUser = {
    [key: string]: string | undefined;
    username: string
    employee_id: string
    email: string
    location: string
    phone_number: string
    role: string
    password1: string
    password2: string
}
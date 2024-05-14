
export type MyResponseType = {
    created: string;
    relative: number;
    by: string;
    username: string;
  }


export type MyResponseContainerType = {
    [key: number]: MyResponseType | null;
  };


  export const initialMyResponse = {
    1: {
    created: "",
    relative: 0,
    by: "",
    username: "",
  }}
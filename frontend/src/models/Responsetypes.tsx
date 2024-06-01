
export type MyResponseType = {
    created: string;
    action: string;
    by: string;
    username: string;
    relative: string;
  }


export type MyResponseContainerType = {
    [key: number]: MyResponseType | null;
  };


  
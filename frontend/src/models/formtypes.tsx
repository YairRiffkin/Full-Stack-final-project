
export type FormDetail = {
    element: string;
    type: string;
    maxLength: number | null;
    options: string[] | null
    name: string;
    placeholder: string;
  }

  export type ItemFormDetail = {
    element: string;
    type: string;
    maxlength?: number | undefined;
    options:  {
              description: string | null; 
              choice: string;
              }[] | null;
    name: string;
    placeholder:  {
                  en: string;
                  heb: string;
                  } 
  }
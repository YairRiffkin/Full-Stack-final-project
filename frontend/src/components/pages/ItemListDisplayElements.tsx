import { ItemListForm } from "../../models/formtypes";
import { ItemFormDetails } from "./ItemFormDisplayElements";

export function ItemListDetails() {  
    const itemListDetails: ItemListForm[] = [
      ...ItemFormDetails.map(item => ({
        name: item.name,
        placeholder: {
          en: item.placeholder.en,
          heb: item.placeholder.heb
        }
      }))
    ];
    return itemListDetails;
  }

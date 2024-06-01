import { ItemListForm } from "../../models/formtypes";
import { ItemFormDetails } from "./ItemFormDisplayElements";

export function ItemListDetails() {
    const newColumns: ItemListForm[] = [
      { name: 'ID', placeholder: { en: 'ID', heb: 'מזהה' } },
      { name: 'REM.', placeholder: { en: 'REM.', heb: 'הערה' } },
      { name: 'Status', placeholder: { en: 'Status', heb: 'סטטוס' } }
    ];
  
    const itemListDetails: ItemListForm[] = [
      ...ItemFormDetails.map(item => ({
        name: item.name,
        placeholder: {
          en: item.placeholder.en,
          heb: item.placeholder.heb
        }
      }))
    ];
    console.log("item list form: ", itemListDetails)
  
    return itemListDetails;
  }
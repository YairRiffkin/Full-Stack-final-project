import { ItemFormDetail } from "../../models/formtypes";
import { Item } from "../../models/itemtypes";
import { User } from "../../models/usertypes";
import { FetchWithToken } from "../functions/FetchFunctions";

export type ItemTrLeadColumnsProps = {
  itemDetail: ItemFormDetail;
}

export type ItemInputProps = { 
  itemDetail: ItemFormDetail;
  handleChange: (event: React.ChangeEvent<
                                        HTMLInputElement | 
                                        HTMLTextAreaElement
                                        >) => void;
  itemForm: Item;
}

export type ItemSelectProps = { 
  itemDetail: ItemFormDetail;
  handleChange: (event: React.ChangeEvent<
                                        HTMLInputElement | 
                                        HTMLTextAreaElement | 
                                        HTMLSelectElement 
                                        >) => void;
  userDetails: User | null;
  itemForm: Item;
}

export type ButtonProps = { 
  itemComplete: boolean;
  setError: React.Dispatch<React.SetStateAction<string[] | null>>;
  itemForm: Item;
}

export function ItemTrHeader() {
  return (
    <thead>
      <tr>
        <th className="en-descr">ENGLISH DESCR.</th>
        <th className="heb-descr">HEBREW DESCR.</th>
        <th className="details">DETAILS</th>
        <th className="remarks">REMARKS</th>
      </tr>
    </thead>
  );
}

export function ItemTrLeadColumns( { itemDetail} : ItemTrLeadColumnsProps) {
  return (  <>
              <td className="en-descr">
                {itemDetail.placeholder.en}
              </td>
              <td className="heb-descr">
                {itemDetail.placeholder.heb}
              </td>
            </>
  );
}

export function ItemInputInput({ itemDetail, handleChange, itemForm }: ItemInputProps) {
  return (
    <input
      type= {itemDetail.type}
      name={itemDetail.name}
      maxLength={itemDetail.maxlength}
      defaultValue={(itemForm[itemDetail.name as keyof Item] || '') as string}
      onChange={handleChange}
    />
  );
}

export function ItemTextAreaInput({ itemDetail, handleChange, itemForm }: ItemInputProps) {
  return (
    <textarea
      className="multiline-input"
      name={itemDetail.name}
      maxLength={itemDetail.maxlength}
      defaultValue={(itemForm[itemDetail.name as keyof Item] || '') as string}
      onChange={handleChange}
    />
  );
}

export function ItemSelectInput({ itemDetail, handleChange, itemForm }: ItemSelectProps) {
  return (
    <select 
      name={itemDetail.name} 
      onChange={(e) => handleChange(e)} 
      value={(itemForm[itemDetail.name as keyof Item] || '') as string}
    >
      {itemDetail.options?.map((option) => {
        return (
          <option key={option.choice} value={option.choice}>
           {option.description} - {option.choice}
          </option>
        );
      })}
    </select>
  );
}

export function ItemSubmitButton({ itemComplete, setError, itemForm }: ButtonProps) {
  return (
    <button type= "submit"
                      disabled={itemComplete}
                      onClick={(e) => {
                        e.preventDefault();
                        FetchWithToken(JSON.stringify(itemForm), "/items/new")
                        .then(data => {
                          console.log("register data: ", data);
                          if (data.error) {
                              setError(data.error);
                              console.log("error: ", data.error)
                          } else {
                              setError(null);
                          }
                      })
                    }}      
              >
                { itemComplete ? <span>Complete the form as requested</span> :<strong>SUBMIT</strong> }
              </button>
  )

}
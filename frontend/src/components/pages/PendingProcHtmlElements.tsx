import { MyResponseContainerType } from "../../models/Responsetypes"
import { ProcurementFormDetail } from "../../models/formtypes";
import { Item } from "../../models/itemtypes";
import { ProcurementFormDetails } from "./ProcurementDisplayElements";


export type DetailsProps = { 
                            pendingData: MyResponseContainerType | null, 
                            indexed: number 
                          }

export type DisplayTableProps = { 
                                  display: Item | null, 
                          }

export function ProcDetailsDisplay({pendingData, indexed}: DetailsProps ) {
  return (
    pendingData && pendingData[indexed] && (
      <table>
          <tbody>
              <tr>
                  <td>Index: {indexed} of {pendingData ? Object.keys(pendingData).length : 0}&nbsp;{"==>"}&nbsp;</td>
                  <td>Approved on: {pendingData[indexed]?.created}&nbsp;{"==>"}&nbsp;</td>
                  <td>By: {pendingData[indexed]?.username}</td>
              </tr>
          </tbody>
      </table>
  )
  )}

  export function ProcDisplayTable ({ display }: DisplayTableProps) {
    const procFormDetails: ProcurementFormDetail[] = ProcurementFormDetails;
    return (
      <table>
        <tbody>
            { display ? (
              procFormDetails?.map((procFormDetail, index) => (
                        <tr key={index}>
                            <td>{procFormDetail.placeholder.heb}: </td>
                            <td>{(display as Item)[procFormDetail.name as keyof Item]}</td>
                        </tr>
                    ))
                  ):(
                        <tr>
                            <td colSpan={ 2 }>No data to display.</td>
                        </tr>
            )}
        </tbody>
    </table>)}

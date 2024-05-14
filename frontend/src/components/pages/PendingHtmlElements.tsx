import { MyResponseContainerType, MyResponseType } from "../../models/Responsetypes"






export type DetailsProps = { 
                            pendingData: MyResponseContainerType | null, 
                            indexed: number 
                          }

export function DetailsDisplay({pendingData, indexed}: DetailsProps ) {
  return (
    pendingData && pendingData[indexed] && (
      <table>
          <tbody>
              <tr>
                  <td>Index: {indexed}</td>
                  <td>Created on: {pendingData[indexed]?.created}</td>
                  <td>By: {pendingData[indexed]?.username}</td>
                  <td>== {pendingData[indexed]?.relative}</td>
              </tr>
          </tbody>
      </table>
  )
  )}


import { useEffect, useState } from 'react';
import '../components/static/ItemListStyle.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;



export function FinalList ({ userToken }: { userToken: string | null }) {
    const [itemDetails, setItemDetails] = useState(null);
    const [details, setDetails] = useState<string[]>([]);
    const [selectTable, setSelectTable] = useState<string>("Basic");
    const [error, setError] = useState<string[] | null>(null)

    useEffect(() => {
      fetch(BACKEND_URL + "/final/basic", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userToken
        },
        body: JSON.stringify({table: selectTable}),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
        })
      .then(data => {
        if (data) {
          if (data.error) { 
            setError(data.error) 
          } else {
          setItemDetails(data.data);
          setDetails(data.details)
        }
      }})
      .catch((error) => {
          alert("Error fetching pending data: " + error.message);
        });
      }, [selectTable, userToken]);

      return (
        <div>
          <div>
          <label htmlFor="selectTable">Type selected table to review:&nbsp;&nbsp;&nbsp;</label>
          <select 
                  name="selectTable"
                  value= {selectTable}
                  onChange={(e) => { setSelectTable(e.target.value); }}
                >
                <option>Basic</option>
                <option>Plant</option>
                <option>Material</option>
                <option>Storage</option>
                <option>Accounting</option>
                <option>Long Text</option>
                <option>Expansion LTMC</option>
                </select>
          </div>
          <br/>
          { error &&
          <small>Please address the below issues before submitting
            <ol>
              { error.map((item) => (
                    <ul>
                        <li>{ item }</li>
                    </ul>
              ))}
            </ol>
          </small>}
          {itemDetails ? (
            <DataTable 
                      value={itemDetails} 
                      sortMode="multiple"
                      removableSort
                      scrollable 
                      scrollHeight="500px"
                      stripedRows 
                      showGridlines
                      tableStyle={{ minWidth: '50rem' }}
            >
                {details?.map((column, index) => (
          <Column 
            key={index} 
            field={column} 
            header={column}
          />
        ))}
            </DataTable>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
}


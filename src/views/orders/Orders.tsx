import { useState, useEffect } from 'react';
import TableComponent from "../../components/table/Table.component";
import { OrdersTableDataModel, PayloadResponseOrdersModel } from './Orders.model';
import { DAY_NAME } from './Orders.constant';
import './Orders.css';

function OrdersView() {

    const headerRow = [
        'Status',
        'Date',
        'Time',
        'Order Number',
        'Total'
    ]

    
    const [tableData, setTableData] = useState<OrdersTableDataModel[]>([]);
    const [isFetchError, setFetchError] = useState<boolean>(false);

    useEffect(() => {
        //fetch data
        fetchOrderAPI();
    }, []);

    async function fetchOrderAPI() {
        try {
            const response = await fetch('https://staging-api.dahmakan.com/test/orders');
            if(response.status === 503) {
                setFetchError(true);
            } else { // assume success
                setFetchError(false);
                const result = await response.json();
                constructNewDataWithResult(result.orders);
            }
        } catch(e) {
            console.log(e);
        }
    }
    
    function constructNewDataWithResult(ordersData: PayloadResponseOrdersModel[]) {
        if(ordersData.length > 0) {
            const currentUnix = Math.round((new Date()).getTime());
            const newResult = ordersData
            .sort((a: PayloadResponseOrdersModel, b: PayloadResponseOrdersModel) => b.arrives_at_utc - a.arrives_at_utc)
            .map((item: PayloadResponseOrdersModel) => {

                let status = '';
                let date = '';
                let time = '';
                if(item.arrives_at_utc === undefined || item.arrives_at_utc === null) {
                    status = 'Cancelled';
                    date = '-';
                    time = '-';
                } else {
                    if(item.arrives_at_utc < currentUnix) {
                        status = 'Delivered';
                    }
    
                    if(item.arrives_at_utc > currentUnix) {
                        status = 'Confirmed';
                    }
    
                    const dateObject = new Date(+item.arrives_at_utc);
                    const year = dateObject.getFullYear();
                    const month = dateObject.getMonth();
                    const day = dateObject.getDate();
                    date = `${DAY_NAME[dateObject.getDay()]}, ${(day) > 9 ? "" : "0"}${day}/${(month + 1) > 9 ? "" : "0"}${month + 1}/${year}`; 
    
                    let hour = dateObject.getHours();
                    let am_pm = 'am';
                    if(hour > 12) {
                        hour -= 12;
                        am_pm = 'pm';
                    }
                    const minute = dateObject.getMinutes();
                    time = `${(hour) > 9 ? "" : "0"}${hour}:${(minute) > 9 ? "" : "0"}${minute} ${am_pm}`;
                }

                return {
                    status,
                    date,
                    time,
                    order_num: item.order_id,
                    total: (item.total_paid).toFixed(2)
                };

            });
            setTableData(newResult);
        }
    }

    return (
        <div className='order-view-container'>

                <div className='table-component-container'>
                {
                    !isFetchError ?
                        <TableComponent
                            headerRow={headerRow}
                            tableData={tableData}
                            tableFor={'order'}
                        />
                        :
                        <p className='error-message'>Oh no! What happened? :(</p>
                }
                </div>

        </div>
    );
}

export default OrdersView;
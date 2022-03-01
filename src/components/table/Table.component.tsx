import './Table.css';

function TableComponent(props: any) {

    const currencySymbol = 'RM';

    return(
        <table>
            <tr>
            {
                props?.headerRow.map((headerLabel: any) => {
                    return <th>{headerLabel}</th>
                })
            }
            </tr>

            {
                props?.tableData.map((itemRow: any) => {
                    return (
                        <tr>
                            <td className={props.tableFor + '-' + itemRow.status}>
                                {itemRow.status}
                            </td>
                            <td>{itemRow.date}</td>
                            <td className={props.tableFor + '-' + 'time'}>
                                {itemRow.time}
                            </td>
                            <td className={props.tableFor + '-' + 'id'}>
                                {itemRow.order_num}
                            </td>
                            <td>{currencySymbol} {itemRow.total}</td>
                        </tr>
                    );
                })
            }
        </table>
    );
}

export default TableComponent;
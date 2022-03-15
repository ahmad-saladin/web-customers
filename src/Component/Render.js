import '../Styles/Render.css';

const Render = (props) => {
  return (
    <section>
      <h1>Customers</h1>
      <div className = 'tbl-header'>
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
          <tr>
            <th>Name</th>
            <th><span>Country</span><input className = 'filter-input' name = 'country' type = 'text' placeholder='Country Filter' onKeyDown={(event)=>props.filterHandler(event)}/></th>
            <th>Phone</th>
            <th><span>State</span><input name = 'state' className = 'filter-input' type = 'text' placeholder='State Filter' onKeyDown={(event)=>props.filterHandler(event)}/></th>
            <th>Code</th>
            </tr>
          </thead>
          </table>
          </div>
          <div className='tbl-content'>
          <table cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            {props.customers.map((customer) => (
              <tr key={Math.random()/0.5}>
                <td>{customer.name}</td>
                <td>{customer.country}</td>
                <td>{customer.phone}</td>
                <td>{customer.state}</td>
                <td>{customer.countryCode}</td>
              </tr>
            ))}
          </tbody>
          <tfooter>
            <div className = 'footer-div'>
              <input type='button' name = 'prev-page' value='Previous' onClick={(event)=>props.paginationHandler(event)} disabled={! props.pageIndex}/>
              <input type='text' name='page-no.' value = {props.pageIndex + 1} readOnly='true'/>
              <input type='button' name = 'next-page' value='Next' onClick={(event)=>props.paginationHandler(event)}/>
            </div>
          </tfooter>
        </table>
      </div>
    </section>
  );
};

export default Render;

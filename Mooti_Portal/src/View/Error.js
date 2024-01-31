const ErrorPage=(label)=>{
    const view=
    `
    <div id="dashboardControlsDiv_id" class="col-12 error">
        <div class="row ms-1 gx-0 px-4   justify-content-center">
            <div class="col-12 d-flex justify-content-center" style="height:20px">
    
                <h2>ERROR: ${label}</h2>
            </div>
        </div>
    </div>`
    ;
    return view;
}

export default ErrorPage;
export default function Footer() {
    return <footer className="app-footer d-flex justify-content-between align-items-center">
        <div className="float-start">
            MyFinance&nbsp;<strong>2025</strong>
        </div>
        <a className="btn btn-success create-transaction-button" title="Create Transaction" href="/transactions/create">
            +
        </a>
        <b className="text-primary float-right">{new Date().toLocaleDateString()}</b>
    </footer>;
}

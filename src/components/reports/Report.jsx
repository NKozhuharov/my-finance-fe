import {Button, Card, CardBody, CardHeader, Col, FormControl, FormGroup, InputGroup, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js';
import {Bar, Doughnut} from "react-chartjs-2";
import {addMonths, endOfMonth, format, startOfMonth, subMonths} from "date-fns";
import InputGroupText from "react-bootstrap/InputGroupText";
import {useApiClient} from "@hooks/useApiClient.js";
import {UserContext} from "@contexts/UserContext.jsx";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

const colorPalette = [
    "#008000", "#FF0000", "#0000FF", "#800080", "#FF4500",
    "#2E8B57", "#2F4F4F", "#008080", "#000080", "#A0522D",
    "#A52A2A", "#2E8B57", "#8B0000", "#9400D3", "#800000",
    "#8B4500", "#808000", "#800000", "#8A2BE2", "#4B0082",
    "#6A5ACD", "#4682B4", "#20B2AA", "#228B22", "#191970",
    "#483D8B", "#3CB371", "#7B68EE", "#00CED1", "#C71585",
    "#FF6347", "#D2B48C", "#8B0000", "#9932CC", "#8B008B",
    "#556B2F", "#008B8B", "#FF8C00", "#ADFF2F", "#CD5C5C",
    "#F08080", "#DC143C", "#FF00FF", "#FFD700", "#D8BFD8",
    "#FFA07A", "#20B2AA", "#87CEFA", "#778899", "#B0C4DE",
    "#FFFFE0", "#00FF00", "#32CD32", "#FAF0E6", "#ADD8E6"
];

//https://react-chartjs-2.js.org/examples/pie-chart

export default function Report() {
    const [barChartData, setBarChartData] = useState({
        title: {
            display: true,
            text: 'Loading...',
        },
        datasets: [],
    });

    const [incomeChartData, setIncomeChartData] = useState({
        title: {
            display: true,
            text: 'Loading...',
        },
        datasets: [],
    });

    const [expenseChartData, setExpenseChartData] = useState({
        title: {
            display: true,
            text: 'Loading...',
        },
        datasets: [],
    });

    const [createdAtFrom, setCreatedAtFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [createdAtTo, setCreatedAtTo] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    const api = useApiClient();
    const {user} = useContext(UserContext);

    useEffect(() => {
        const fetchBarChartData = async () => {
            try {
                let url = `/transactions?aggregate[]=report&limit=empty&filters[date][gte]=${createdAtFrom}&filters[date][lte]=${createdAtTo}`;
                if (!user.active_wallet_id) {
                    //resolve wallet to show it in the list of categories
                    url += '&resolve[]=category-wallet';
                }
                const response = await api.get(url);
                const responseData = response.data.meta.aggregate.report;

                setBarChartData(responseData.bar_chart_data);
                const incomeChartData = {
                    title: responseData.income_chart_data.title,
                    labels: responseData.income_chart_data.datasets.map(item => item.name),
                    datasets: [
                        {
                            data: responseData.income_chart_data.datasets.map(item => item.amount), // Ensure this contains numeric values
                            backgroundColor: colorPalette
                        }
                    ]
                }
                setIncomeChartData(incomeChartData);
                const expenseChartData = {
                    title: responseData.expense_chart_data.title,
                    labels: responseData.expense_chart_data.datasets.map(item => item.name),
                    datasets: [
                        {
                            data: responseData.expense_chart_data.datasets.map(item => item.amount), // Ensure this contains numeric values
                            backgroundColor: colorPalette
                        }
                    ]
                }
                setExpenseChartData(expenseChartData);
                // setExpenseChartData(responseData.expense_chart_data);
            } catch (err) {
                console.error("Error fetching transactions data: ", err);
            }
        };

        fetchBarChartData();
        document.title = "Reports";
    }, [api, user.active_wallet_id, createdAtFrom, createdAtTo]);

    const handleSetPrevMonth = () => {
        setCreatedAtFrom((prevState) => {
            const firstDayPrevMonth = startOfMonth(subMonths(new Date(prevState), 1));
            return format(firstDayPrevMonth, 'yyyy-MM-dd');
        });
        setCreatedAtTo((prevState) => {
            const lastDayPrevMonth = endOfMonth(subMonths(new Date(prevState), 1));
            return format(lastDayPrevMonth, 'yyyy-MM-dd');
        });
    }

    const handleSetNextMonth = () => {
        setCreatedAtFrom((prevState) => {
            const firstDayPrevMonth = startOfMonth(addMonths(new Date(prevState), 1));
            return format(firstDayPrevMonth, 'yyyy-MM-dd');
        });
        setCreatedAtTo((prevState) => {
            const lastDayPrevMonth = endOfMonth(addMonths(new Date(prevState), 1));
            return format(lastDayPrevMonth, 'yyyy-MM-dd');
        });
    }

    return (
        <>
            <Row>
                <Col>
                    <Card className="card-primary">
                        <CardHeader>
                            Wallets
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <FormGroup className="col-6 col-md-3 col-lg-2">
                                    <InputGroup>
                                        <div className="input-group-prepend">
                                            <InputGroupText>From</InputGroupText>
                                        </div>
                                        <FormControl type="date" name="created_at_from" value={createdAtFrom} className="form-control" onChange={(e) => setCreatedAtFrom(e.target.value)}/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="col-6 col-md-3 col-lg-2">
                                    <InputGroup>
                                        <div className="input-group-prepend">
                                            <InputGroupText>To</InputGroupText>
                                        </div>
                                        <FormControl type="date" name="created_at_to" value={createdAtTo} className="form-control" onChange={(e) => setCreatedAtTo(e.target.value)}/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="col-6 col-md-3 col-lg-2 col-xl-1 mt-3 mt-md-0 mt-lg-0">
                                    <Button className="btn-primary w-100" title="Previous month" onClick={handleSetPrevMonth}>
                                        <i className="bi bi-arrow-left"></i>
                                    </Button>
                                </FormGroup>
                                <FormGroup className="col-6 col-md-3 col-lg-2 col-xl-1 mt-3 mt-md-0 mt-lg-0">
                                    <Button className="btn-primary w-100" title="Next month" onClick={handleSetNextMonth}>
                                        <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </FormGroup>
                            </Row>

                            <hr/>

                            <Row>
                                <Col>
                                    <Bar
                                        height="400"
                                        data={barChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                                title: barChartData.title,
                                                tooltip: {
                                                    displayColors: false,
                                                    titleAlign: 'right',
                                                    bodyAlign: 'right',
                                                    callbacks: {
                                                        label: function (context) {
                                                            let label = context.dataset.label || '';
                                                            if (context.raw) {
                                                                label += context.raw;
                                                            }
                                                            return `${label}${user.active_wallet.currency.symbol}`;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Col>
                            </Row>

                            <hr/>

                            <Row>
                                <Col lg={6} sm={12}>
                                    <Doughnut
                                        height="400"
                                        data={incomeChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {display: false},
                                                title: incomeChartData.title,
                                                tooltip: {
                                                    displayColors: false,
                                                    callbacks: {
                                                        label: function (context) {
                                                            const amount = context.raw; // Numeric value
                                                            return `${amount}${user.active_wallet.currency.symbol}`;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Col>
                                <Col lg={6} sm={12}>
                                    <Doughnut
                                        height="400"
                                        data={expenseChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {display: false},
                                                title: expenseChartData.title,
                                                tooltip: {
                                                    displayColors: false,
                                                    callbacks: {
                                                        label: function (context) {
                                                            const amount = context.raw; // Numeric value
                                                            return `${amount}${user.active_wallet.currency.symbol}`;
                                                        }
                                                    }
                                                }
                                            },
                                            onClick: (event, elements, chart) => {
                                                if (elements.length > 0) {
                                                    //@todo - implement category select :) :(((
                                                    console.log('clicked');
                                                    // // Access original jsonData for `id`
                                                    // const i = elements[0].index;
                                                    // const categoryId = jsonData{{ $reportName }}.data[i].id; // Retrieve `id` from the original data
                                                    //
                                                    // // Redirect using the category id
                                                    // let url = new URL(window.location.href);
                                                    // url.searchParams.set('category_id', categoryId);
                                                    // window.location.href = url.href;
                                                }
                                            }
                                        }}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

import {Button, Card, CardBody, CardHeader, Col, FormControl, FormGroup, InputGroup, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, Title, Tooltip} from 'chart.js';
import {Bar} from "react-chartjs-2";
import {addMonths, endOfMonth, format, startOfMonth, subMonths} from "date-fns";
import InputGroupText from "react-bootstrap/InputGroupText";
import {useApiClient} from "@hooks/useApiClient.js";
import {UserContext} from "@contexts/UserContext.jsx";
import DoughnutChart from "@components/reports/charts/doughnut-chart/DoughnutChart.jsx";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";

//https://react-chartjs-2.js.org/examples/pie-chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

export default function Report() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [barChartData, setBarChartData] = useState({
        title: {
            display: true,
            text: 'Loading...',
        },
        datasets: [],
    });

    const [incomeChartData, setIncomeChartData] = useState({
        title: {},
        datasets: [],
    });

    const [expenseChartData, setExpenseChartData] = useState({
        title: {},
        datasets: [],
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryDetails, setSelectedCategoryDetails] = useState(null);

    const [createdAtFrom, setCreatedAtFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [createdAtTo, setCreatedAtTo] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    const api = useApiClient();
    const {user} = useContext(UserContext);

    useEffect(() => {
        const fetchBarChartData = async () => {
            try {
                let url = `/transactions?aggregate[]=report&limit=empty&filters[date][gte]=${createdAtFrom}&filters[date][lte]=${createdAtTo}`;
                if (selectedCategoryId) {
                    //resolve wallet to show it in the list of categories
                    url += `&filters[category_id]=${selectedCategoryId}`;
                }
                const response = await api.get(url);
                const responseData = response.data.meta.aggregate.report;

                setBarChartData(responseData.bar_chart_data);
                setIncomeChartData(responseData.income_chart_data);
                setExpenseChartData(responseData.expense_chart_data);
                setSelectedCategory(responseData.selected_category);
                setSelectedCategoryDetails(responseData.selected_category_details);
            } catch (err) {
                console.error("Error fetching transactions data: ", err);
            }
        };

        fetchBarChartData();
        document.title = "Reports";
    }, [api, selectedCategoryId, createdAtFrom, createdAtTo, user.active_wallet_id]);

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
                            Reports
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
                                    {selectedCategoryId && selectedCategory && selectedCategory.type === 'Expense' ? (
                                        <DoughnutChart
                                            apiChartData={expenseChartData.datasets}
                                            apiChartTitleData={expenseChartData.title}
                                            setSelectedCategoryId={setSelectedCategoryId}
                                        />
                                    ) : (
                                        <DoughnutChart
                                            apiChartData={incomeChartData.datasets}
                                            apiChartTitleData={incomeChartData.title}
                                            setSelectedCategoryId={setSelectedCategoryId}
                                        />
                                    )}
                                </Col>
                                <Col lg={6} sm={12} className="mt-3 mt-lg-0">
                                    {selectedCategory ? (
                                        <Card className="card-primary mt-3 mt-lg-0">
                                            <CardHeader>
                                                <div className="card-tools-left">
                                                    <a className="btn btn-tool" href="#" title="Back" onClick={() => setSelectedCategoryId(selectedCategory.parent_category_id)}>
                                                        <i className="bi bi-arrow-left"></i>
                                                    </a>
                                                </div>
                                                Details
                                            </CardHeader>
                                            <CardBody>
                                                {selectedCategoryDetails.map((categoryDetail) => (
                                                    <Row className="border-bottom pb-2 pt-2 cursor-pointer" key={categoryDetail.id} title={`View details for ${categoryDetail.name}`}
                                                         onClick={() => setSelectedCategoryId(categoryDetail.id)}>
                                                        <Col className="text-start">
                                                            <div className="d-flex align-items-center">
                                                                <CategoryNameAndIcon name={categoryDetail.name} icon={categoryDetail.icon}/>
                                                            </div>
                                                        </Col>
                                                        <Col className={`text-end${selectedCategory.type === 'Expense' ? ' expense-color' : ' income-color'}`}>
                                                            <strong>{categoryDetail.amount}{user.active_wallet.currency.symbol}</strong>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </CardBody>
                                        </Card>
                                    ) : (
                                        <DoughnutChart
                                            apiChartData={expenseChartData.datasets}
                                            apiChartTitleData={expenseChartData.title}
                                            setSelectedCategoryId={setSelectedCategoryId}
                                        />
                                    )}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

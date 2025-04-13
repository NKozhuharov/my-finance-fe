import {Doughnut} from "react-chartjs-2";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "@contexts/UserContext.jsx";
import {colorPalette} from "@utils/chartColors.js";
import {ArcElement, Chart as ChartJS, Legend, Title, Tooltip} from "chart.js";

ChartJS.register(
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

export default function DoughnutChart({apiChartData, apiChartTitleData, setSelectedCategoryId}) {
    const [chartTitle, setChartTitle] = useState({
        display: true,
        align: 'start',
        text: 'Loading...',
        font: {
            size: 16
        }
    });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const {user} = useContext(UserContext);

    useEffect(() => {
        if (!apiChartData || apiChartData.length === 0) {
            return;
        }

        const chartDataset = {
            labels: apiChartData.map(item => item.name),
            datasets: [
                {
                    data: apiChartData.map(item => item.amount), // Ensure this contains numeric values
                    backgroundColor: colorPalette
                }
            ]
        }
        setChartData(chartDataset);
        setChartTitle((currentTitle) => ({...currentTitle, ...apiChartTitleData}));
    }, [apiChartData, apiChartTitleData])

    return <Doughnut
        height="400"
        data={chartData}
        options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {display: false},
                title: chartTitle,
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
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const clickedElementIndex = elements[0].index;
                    const clickedCategoryId = apiChartData[clickedElementIndex].id;

                    setSelectedCategoryId(clickedCategoryId);
                }
            },
            onHover: (event, chartElement) => {
                // Change cursor to pointer if an element is hovered
                if (chartElement.length) {
                    event.native.target.style.cursor = 'pointer';
                } else {
                    event.native.target.style.cursor = 'default';
                }
            },
        }}
    />;
}
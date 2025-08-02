import moment from "moment";

export const validateEmail = (email) => {
 const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
 return regex.test(email);
};

export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';

  const words = name.trim().split(/\s+/);
  let initials = '';

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i]) {
      initials += words[i][0];
    }
  }

  return initials.toUpperCase();
};


 export const addThousandsSeparator = (num) =>{
  if(num == null || isNaN(num)) return'';

  const [integerPart, fractionalPart] = num.toString().split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
}

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item, index)=>({
     month: `${item.category} - ${moment(item.date).format('DD/MM')} #${index + 1}`,
    //category: item?.category,
    amount: item?.amount,
  }))

  return chartData
}

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

  const chartData = sortedData.map((item, index) => ({
     month: `${item.source} - ${moment(item.date).format('DD/MM')} #${index + 1}`,
   
    
    amount: item?.amount,
  }));

  return chartData
}

export const prepareExpenseLineChartData = (data = []) => {
  const soredData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

  const chartData = soredData.map((item, index) => ({
    month: `${item.category} - ${moment(item.date).format('DD/MM')} #${index + 1}`,
    //month: moment(item.date).format('DD/MM/YYYY'),
    amount: item?.amount,
    //category: item?.category,
  }));

  return chartData
}
import {useState, useCallback} from 'react';
import {Card, DatePicker} from '@shopify/polaris';

const RemainingBalanceCharge = ({remainBalanceChargeDate, onChange}) => {
  const currentRemainingBalanceChargeDate = remainBalanceChargeDate.start;

  const [{month, year}, setDate] = useState({
    month: currentRemainingBalanceChargeDate.getMonth(),
    year: currentRemainingBalanceChargeDate.getFullYear(),
  });

  const handleChange = useCallback((newValue) => {
    onChange(newValue);
  }, []);

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  return (
    <Card title="Remaining balance charge date" sectioned>
      <DatePicker
        month={month}
        year={year}
        onChange={handleChange}
        onMonthChange={handleMonthChange}
        selected={remainBalanceChargeDate}
      />
    </Card>
  );
};

export default RemainingBalanceCharge;

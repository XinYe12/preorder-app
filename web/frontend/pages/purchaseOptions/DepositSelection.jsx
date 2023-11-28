import {useCallback} from 'react';
import {Card, Select} from '@shopify/polaris';
import {depositValue} from '../../constants.js';

const DepositSelection = ({depositAmount, onChange}) => {
  const handleSelectionChange = useCallback((newValue) => {
    onChange(newValue);
  }, []);

  const options = [
    {label: 'No deposit', value: depositValue.NoDeposit},
    {label: '25% deposit', value: depositValue.Deposit25},
    {label: '50% deposit', value: depositValue.Deposit50},
    {label: '75% deposit', value: depositValue.Deposit75},
    {label: 'Full deposit', value: depositValue.FullDeposit},
  ];

  return (
    <Card title="Deposit" sectioned>
      <Select
        label="Select the deposit amount"
        options={options}
        onChange={handleSelectionChange}
        value={parseInt(depositAmount)}
      />
    </Card>
  );
};

export default DepositSelection;

import {useEffect} from 'react';

const TodayTitle = (period) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);
  }, [period]);

  return (
    <Text>
        {count == 2 ? 'Tomorrow' : count == 4 ? 'Next 2 days' : 'Today'}
    </Text>
  );
};
export default TodayTitle;

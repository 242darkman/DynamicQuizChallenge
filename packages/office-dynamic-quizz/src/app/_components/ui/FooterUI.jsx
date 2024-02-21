'use client';

import { Progress } from 'antd';

const FooterUI = ({ totalScore, round, totalRounds }) => {
  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div>
        <h2 className="text-xl font-bold">Score Total: {totalScore}</h2>
        
      </div>
      <div>
        <p className="text-xl">Round: {round}/{totalRounds}</p>
        <Progress strokeColor={{ from: '#108ee9', to: '#87d068' }} percent={(round / totalRounds) * 100} status="active" />
      </div>
    </div>
  );
};

export default FooterUI;
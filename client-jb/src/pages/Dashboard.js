import { useEffect } from "react";

const Dashboard = () => {
  const fetchData = async () => {
    try {
      //const response = await fetch("/data.json");
      const response = await fetch("/api/v1");

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return <h1>Dashboard Page</h1>;
};

export default Dashboard;

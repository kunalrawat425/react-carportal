import {
  Alert,
  AppBar,
  Grid,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CarDetailsCard from "./components/cardDetailsCard";
import { FilterFacets } from "./components/filterFacets";
import { data } from "./data";

function App() {
  const [cars, setCars] = useState(data);
  const [state, setFilters] = useState<{
    year: string[];
    brand: string[];
    model: string[];
  }>({
    year: [],
    brand: [],
    model: [],
  });

  const brands = [...new Set(data.map((car) => car.brand).sort())];
  const models = [...new Set(data.map((car) => car.model).sort())];
  const years = [...new Set(data.map((car) => car.year).sort())];

  const filterConfigs = [
    { label: "brand", filterValues: brands },
    { label: "model", filterValues: models },
    { label: "year", filterValues: years },
  ];

  useEffect(() => {
    if (
      state.year.length <= 0 &&
      state.model.length <= 0 &&
      state.brand.length <= 0
    ) {
      setCars(data);
    }
  }, [state]);

  const getFilterCategory = (expr: string) => {
    switch (expr) {
      case "year":
        return state.year;
      case "brand":
        return state.brand;
      case "model":
        return state.model;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
        return [];
    }
  };
  const resetFilters = () => {
    setFilters({
      year: [],
      brand: [],
      model: [],
    });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filter = getFilterCategory(event.target.name);
    const isAlreadyAvailable = filter.findIndex(
      (filterValues) => filterValues === event.target.value
    );
    if (event.target.checked && isAlreadyAvailable < 0) {
      filter.push(event.target.value);
    } else {
      filter.splice(isAlreadyAvailable, 1);
    }

    setFilters({
      ...state,
      [event.target.name]: filter,
    });
    // eslint-disable-next-line no-eval
    setCars(
      cars.filter((car) => eval(`car.${event.target.name}`).includes(filter))
    );
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            Car Dekho
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            All new
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} p={8} pt={12}>
        <Grid item xs={2}>
          {filterConfigs.map(({ label, filterValues }) => (
            <FilterFacets
              key={label}
              category={label}
              filters={filterValues}
              handleChange={handleChange}
            />
          ))}
        </Grid>
        <Grid item xs={10}>
          <Grid container spacing={{ xs: 4 }}>
            {cars.map((car) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={car.id}>
                <CarDetailsCard car={car} />
              </Grid>
            ))}
          </Grid>
          {cars.length <= 0 && (
            <Alert variant="outlined" severity="error" sx={{ mt: "20px" }}>
              No cars found for selected filters, try resetting filters
              <Link
                onClick={() => resetFilters()}
                sx={{ marginLeft: "10px", cursor: "pointer" }}
              >
                {"Reset filters"}
              </Link>
            </Alert>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;

import React, { useReducer, useEffect, useState } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import {
  Alert,
  Page,
  PageHeader,
  PageSidebar,
  PageSection,
  Text,
  TextVariants,
  Wizard
} from "@patternfly/react-core";
import BasicInformation from "./Steps/01_BasicInformation";
import PointOfContact from "./Steps/02_PointOfContact";
import ClusterInformation from "./Steps/03_ClusterInformation";
import ClusterUsers from "./Steps/04_ClusterUsers";
import LaunchCluster from "./Steps/05_LaunchCluster";
import Logo from "./Components/Logo/Logo";
import formReducer from "./formReducer";
import initialState from "./initialState";
import yaml from "yaml";
import axios from "axios";

const App = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [clusterOptions, setClusterOptions] = useState(null);
  const [hasError, setHasError] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/engagements/config`)
      .then(response => {
        const data = yaml.parse(response.data.fileContent);
        console.log(data);
        setClusterOptions(data);
        dispatch({
          type: "ocp_cloud_provider_region",
          payload: data.providers[0].regions[0].value
        });
        dispatch({
          type: "ocp_cloud_provider_name",
          payload: data.providers[0].value
        });
        dispatch({
          type: "ocp_cluster_size",
          payload: data.openshift["cluster-size"][0].value
        });
        dispatch({
          type: "ocp_version",
          payload: data.openshift.versions[0].value
        });
      })
      .catch(error => {
        setHasError(error);
      });
  }, []);
  return (
    <Page
      header={<PageHeader />}
      sidebar={<PageSidebar isNavOpen theme="dark" nav={<Logo />} />}
      style={{ height: "100vh" }}
    >
      <PageSection>
        <div className="pf-c-content">
          <Text component={TextVariants.h1}>Engagement Data Gathering</Text>
        </div>
        {hasError ? (
          <Alert isInline title="We encountered an error." variant="danger">
            {hasError.statusText}
          </Alert>
        ) : null}
      </PageSection>
      <PageSection>
        <Wizard
          isCompactNav
          isInPage
          steps={[
            {
              name: "Basic Information",
              component: (
                <BasicInformation values={state} onChange={dispatch} />
              ),
              hideCancelButton: true
            },
            {
              name: "Point of Contact",
              component: <PointOfContact values={state} onChange={dispatch} />,
              hideCancelButton: true
            },
            {
              name: "OpenShift Cluster",
              component: (
                <ClusterInformation
                  options={clusterOptions}
                  values={state}
                  onChange={dispatch}
                />
              ),
              hideCancelButton: true
            },
            {
              name: "Cluster Users",
              component: <ClusterUsers
                          options={clusterOptions}
                          values={state}
                          onChange={dispatch}
                        />,
              hideCancelButton: true
            },
            {
              name: "Launch Cluster",
              component: <LaunchCluster values={state} onChange={dispatch} />,
              hideCancelButton: true,
              isFinishedStep: true
            }
          ]}
        />
      </PageSection>
    </Page>
  );
};

export default App;

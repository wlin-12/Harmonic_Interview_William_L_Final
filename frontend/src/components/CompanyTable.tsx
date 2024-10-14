import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { addAllToLikedCompanies, addAllToMyList, addIndividualCompanyToLikedCompanies, addIndividualCompanyToMyList, getCollectionsById, ICompany } from "../utils/jam-api";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: 'rgba(18, 18, 18, 0.9)',
  ...theme.applyStyles('light', {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }),
}));

const CompanyTable = (props: { selectedCollectionId: string }) => {
  const [response, setResponse] = useState<ICompany[]>([]);
  const [total, setTotal] = useState<number>();
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState(25);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
      (newResponse) => {
        setResponse(newResponse.companies);
        setTotal(newResponse.total);
      }
    );
  }, [props.selectedCollectionId, offset, pageSize]);

  useEffect(() => {
    setOffset(0);
  }, [props.selectedCollectionId]);

  function CustomLoadingOverlay() {
    return (
      <><LinearProgress color="primary"></LinearProgress><StyledGridOverlay>
        <Box sx={{ mt: 2 }}>Adding items to new list! This process might take longer than expected.</Box>
      </StyledGridOverlay></>
    );
  }

  const add_individual_company_to_liked_companies_button = () => {
    setLoading(true)
    const selectedRows = response.filter(row => selectionModel.includes(row.id)).map(response => response.id);
    addIndividualCompanyToLikedCompanies(selectedRows).then(
      () => {
        getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
          (newResponse) => {
            setResponse(newResponse.companies);
            setTotal(newResponse.total);
            setLoading(false)
            handleClickOpen();
          }
        );
      }
    );
  };

  const add_individual_company_to_my_list_button = () => {
    setLoading(true)
    const selectedRows = response.filter(row => selectionModel.includes(row.id)).map(response => response.id);
    addIndividualCompanyToMyList(selectedRows).then(
      () => {
        getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
          (newResponse) => {
            setResponse(newResponse.companies);
            setTotal(newResponse.total);
            setLoading(false);
            handleClickOpen();
          }
        );
      }
    );
  };

  const add_all_to_my_list_button = () => {
    setLoading(true)
    addAllToMyList().then(
      () => {
        getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
          (newResponse) => {
            setResponse(newResponse.companies);
            setTotal(newResponse.total);
            setLoading(false);
            handleClickOpen();
          }
        );
      }
    );
  };

  const add_all_to_liked_companies_button = () => {
    setLoading(true)
    addAllToLikedCompanies().then(
      () => {
        getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
          (newResponse) => {
            setResponse(newResponse.companies);
            setTotal(newResponse.total);
            setLoading(false);
            handleClickOpen();
          }
        );
      }
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div>
      <div style={{ height: 800, width: "100%" }}>
        <DataGrid
          rows={response}
          rowHeight={30}
          columns={[
            { field: "liked", headerName: "Liked", width: 90 },
            { field: "id", headerName: "ID", width: 90 },
            { field: "company_name", headerName: "Company Name", width: 200 },
          ]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          rowCount={total}
          pagination
          checkboxSelection
          paginationMode="server"
          onPaginationModelChange={(newMeta) => {
            setPageSize(newMeta.pageSize);
            setOffset(newMeta.page * newMeta.pageSize);
          }}
          onRowSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection);
          }}
          slots={{
            loadingOverlay: CustomLoadingOverlay,
          }}
          loading={loading}
        />
      </div>
      <ButtonGroup>
        <Button
          variant="outlined"
          color="primary"
          onClick={add_individual_company_to_liked_companies_button}
          style={{ marginTop: '16px' }}
        >
          Add individual companies to Liked Companies
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={add_all_to_liked_companies_button}
          style={{ marginTop: '16px' }}
        >
          Add all companies to Liked Companies
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          variant="outlined"
          color="primary"
          onClick={add_individual_company_to_my_list_button}
          style={{ marginTop: '16px' }}
        >
          Add individual companies to My List
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={add_all_to_my_list_button}
          style={{ marginTop: '16px' }}
        >
          Add all companies to My List
        </Button>
      </ButtonGroup>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Completed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have successfully moved companies between lists.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompanyTable;

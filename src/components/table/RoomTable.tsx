import {
  Typography,
  Box,
  IconButton,
  Stack,
  Card,
  CardContent,
  Button,
  TextFieldProps,
  InputAdornment,
  Link,
} from "@mui/material";

import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconSearch,
  IconEye,
} from "@tabler/icons-react";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import RoomModel from "@/model/room";

const RoundTextField = styled((props: TextFieldProps) => (
  <CustomTextField {...props} />
))(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "40px",
  },
  "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "0.8",
  },
  "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "1",
  },
  "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
}));

type RoomTableProps = {
  paginationData?: {
    rooms: RoomModel[];
    total: number;
    page: number;
    limit: number;
  };
  onAddClicked?: () => void;
  onEditClicked?: (room: RoomModel) => void;
  onDeleteClicked?: (id: string) => void;
  onSearching?: (query: string) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onPageChanged?: (page: number) => void;
};

const RoomTable = ({
  paginationData,
  onAddClicked,
  onEditClicked,
  onDeleteClicked,
  onSearching,
  onRowsPerPageChange,
  onPageChanged,
}: RoomTableProps) => {
  const rooms = paginationData?.rooms || [];
  const totalRooms = paginationData?.total || 0;
  const page = (paginationData?.page || 1) - 1;
  const limit = paginationData?.limit || 10;

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nama",
      width: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          variant="subtitle2"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "description",
      headerName: "Deskripsi",
      width: 600,
      renderCell: (params) => (
        <Typography
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          variant="subtitle2"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 300,
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="view"
            component={Link}
            href={`/room/${params.row.id}`}
            >
        <IconEye size={20} />
      </IconButton>
          <IconButton
            aria-label="edit"
            onClick={() => {
              if (onEditClicked) {
                onEditClicked(params.row);
              }
            }}
          >
            <IconEdit size={20} />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              if (onDeleteClicked) {
                onDeleteClicked(params.row.id);
              }
            }}
          >
            <IconTrash size={20} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Card sx={{ height: "100%", maxHeight: 500 }}>
      <CardContent>
        <div className="flex flex-col md:flex-row">
          <div className="flex mb-4 flex-grow">
            <div className="flex-grow">
              <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
                Daftar Ruangan
              </Typography>
              <Typography variant="body1" color="gray">
                Berikut daftar ruangan yang tersedia
              </Typography>
            </div>
            <div className="flex items-center">
              <div>
                <Button variant="contained" size="small" onClick={onAddClicked}>
                  <IconPlus size={20} /> Tambah
                </Button>
              </div>
            </div>
          </div>
        </div>
        <hr className="mb-4 border" />
        <div className="flex space-x-4">
          <RoundTextField
            placeholder="Cari ruangan"
            className="flex-grow max-w-96"
            onChange={(e) => {
              if (onSearching) {
                onSearching(e.target.value);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Box>
          <Box sx={{ height: 350, width: "100%" }}>
            <DataGrid
              rows={rooms}
              columns={columns}
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomTable;

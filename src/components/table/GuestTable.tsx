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
  Avatar,
  Chip,
  Tooltip,
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
import GuestModel from "@/model/guest";
import { IconSend } from "@tabler/icons-react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";

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

type GuestTableProps = {
  paginationData?: {
    guests: GuestModel[];
    total: number;
    page: number;
    limit: number;
  };
  onAddClicked?: () => void;
  onSendAllQrCode?: () => void;
  onSendGuestQrCode?: (guestId: string) => void;
  onEditClicked?: (guest: GuestModel) => void;
  onDeleteClicked?: (id: string) => void;
  onQRImageClicked?: (id: string) => void;
  onSearching?: (query: string) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onPageChanged?: (page: number) => void;
};

const GuestTable = ({
  paginationData,
  onAddClicked,
  onSendAllQrCode,
  onSendGuestQrCode,
  onEditClicked,
  onDeleteClicked,
  onQRImageClicked,
  onSearching,
  onRowsPerPageChange,
  onPageChanged,
}: GuestTableProps) => {
  const guests = paginationData?.guests || [];
  const totalGuests = paginationData?.total || 0;
  // const page = (paginationData?.page || 1) - 1;
  // const limit = paginationData?.limit || 10;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const columns: GridColDef[] = [
    {
      field: "profile",
      headerName: "Profil",
      width: 150,
      renderCell: () => <Avatar alt="person image" />,
      align: "center",
    },
    {
      field: "name",
      headerName: "Nama",
      width: 200,
      renderCell: (params) => (
        <div className="h-full flex items-center">
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
        </div>
      ),
    },
    {
      field: "key",
      headerName: "Kode Tamu",
      width: 150,
      renderCell: (params) => (
        <div className="h-full flex items-center">
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
        </div>
      ),
    },
    {
      field: "gender",
      headerName: "Kelamin",
      headerAlign: "center",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Chip
          color={params.value === "male" ? "success" : "info"}
          label={params.value === "male" ? "Laki-Laki" : "Perempuan"}
        />
      ),
    },
    {
      field: "address",
      headerName: "Alamat",
      headerAlign: "center",
      width: 300,
      align: "center",
      renderCell: (params) => (
        <div className="h-full inline-flex items-center">
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.value ? params.value : "-"}
          </Typography>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      align: "center",
      renderCell: (params) => (
        <div className="h-full inline-flex items-center">
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.value ? params.value : "-"}
          </Typography>
        </div>
      ),
    },
    {
      field: "phone",
      headerName: "No Telp",
      width: 150,
      renderCell: (params) => (
        <div className="h-full inline-flex items-center">
          <Typography variant="subtitle2" color="textSecondary">
            {params.value ? params.value : "-"}
          </Typography>
        </div>
      ),
    },
    {
      field: "qrCode",
      headerName: "QR Code",
      width: 100,
      align: "center",
      renderCell: (params) => (
         <Stack direction="row" spacing={1}>
           <IconButton
            aria-label="view qr"
            onClick={() => {
              if (onQRImageClicked) {
                onQRImageClicked(params.row.id);
              }
            }}
          >
            <IconEye size={20} />
          </IconButton>
          <IconButton
            aria-label="send qr"
            onClick={() => {
              if (onSendGuestQrCode) {
                onSendGuestQrCode(params.row.id);
              }
            }}
          >
            <IconSend size={20} />
          </IconButton>
         </Stack>
      ),
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
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

  const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
    const selectedRows = guests.filter((guest) =>
      selectionModel.includes(guest.id)
    );
    const emails = selectedRows.map((guest) => guest.email);
    setSelectedEmails(emails);
  };

  return (
    <Card sx={{ height: "100%", maxHeight: "500px", maxWidth: "900px", width: "100%" }}>
      <CardContent>
        <div className="flex flex-col md:flex-row">
          <div className="flex mb-4 flex-grow">
            <div className="flex-grow">
              <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
                Daftar Tamu
              </Typography>
              <Typography variant="body1" color="gray">
                Berikut tamu yang telah terdaftar
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
            placeholder="Cari tamu"
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
          <Tooltip title="Kirim kode QR ke semua tamu">
            <Button
              variant="contained"
              size="small"
              className="h-fit my-auto"
              onClick={onSendAllQrCode}
            >
              Kirim <IconSend size={18} />
            </Button>
          </Tooltip>
        </div>
        <Box>
          <Box sx={{ height: 350, width: "100%" }}>
            <DataGrid
              paginationMode="server"
              rowCount={totalGuests}
              rows={guests}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50, 100]}
              onRowSelectionModelChange={handleSelectionChange}
              onPaginationModelChange={(param) => {
                if (onRowsPerPageChange) {
                  onRowsPerPageChange(param.pageSize);
                }
                if (onPageChanged) {
                  onPageChanged(param.page + 1);
                }
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GuestTable;

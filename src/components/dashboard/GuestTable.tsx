import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Card,
  CardContent,
  Button,
  TextFieldProps,
  InputAdornment,
  TableContainer,
  TablePagination,
  Avatar,
  Chip,
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

const RoundTextField = styled((props: TextFieldProps) => (
  <CustomTextField {...props} />
))(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "15px",
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
  onEditClicked,
  onDeleteClicked,
  onQRImageClicked,
  onSearching,
  onRowsPerPageChange,
  onPageChanged,
}: GuestTableProps) => {
  const guests = paginationData?.guests || [];
  const totalGuests = paginationData?.total || 0;
  const page = (paginationData?.page || 1) - 1;
  const limit = paginationData?.limit || 10;

  return (
    <Card sx={{ height: "100%", maxHeight: "600px" }}>
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
                <Button
                  variant="contained"
                  size="large"
                  sx={{ clipPath: "circle()" }}
                  onClick={onAddClicked}
                >
                  <IconPlus size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div>
            <RoundTextField
              placeholder="Cari tamu"
              sx={{ width: "100%" }}
              onChange={(e) => {
                if (onSearching) {
                  onSearching(e.target.value);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <Box>
          <TableContainer sx={{ maxHeight: 350, maxWidth: "760px" }}>
            <Table
              stickyHeader
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
                mt: 2,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Profil
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Nama
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Kode Tamu
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Kelamin
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Alamat
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      No Telp
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      QR Code
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Aksi
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell align="center">
                      <Avatar alt="person image" />
                    </TableCell>
                    <TableCell
                      sx={{ maxWidth: "200px", overflow: "hidden" }}
                      align="left"
                    >
                      <Typography
                        sx={{
                          lineClamp: 1,
                          WebkitLineClamp: 1,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        color="textSecondary"
                        variant="subtitle2"
                      >
                        {guest.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ maxWidth: "150px", overflow: "hidden" }}
                      align="center"
                    >
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "500",
                          lineClamp: 1,
                          WebkitLineClamp: 1,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {guest.key}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        color={guest.gender === "male" ? "success" : "info"}
                        label={
                          guest.gender === "male" ? "Laki-Laki" : "Perempuan"
                        }
                      />
                    </TableCell>
                    <TableCell
                      sx={{ maxWidth: "300px", overflow: "hidden" }}
                      align="center"
                    >
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                        sx={{
                          lineClamp: 1,
                          WebkitLineClamp: 1,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {guest.address ? guest.address : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ maxWidth: "200px", overflow: "hidden" }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                        sx={{
                          lineClamp: 1,
                          WebkitLineClamp: 1,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {guest.email ? guest.email : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {guest.phone ? guest.phone : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="view qr"
                        onClick={() => {
                          if (onQRImageClicked) {
                            onQRImageClicked(guest.id);
                          }
                        }}
                      >
                        <IconEye size={20} />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            if (onEditClicked) {
                              onEditClicked(guest);
                            }
                          }}
                        >
                          <IconEdit size={20} />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            if (onDeleteClicked) {
                              onDeleteClicked(guest.id);
                            }
                          }}
                        >
                          <IconTrash size={20} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ marginTop: 2 }}
            component="div"
            count={totalGuests}
            page={page}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => {
              if (onRowsPerPageChange) {
                onRowsPerPageChange(parseInt(e.target.value));
              }
            }}
            onPageChange={(e, page) => {
              if (onPageChanged) {
                onPageChanged(page);
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default GuestTable;

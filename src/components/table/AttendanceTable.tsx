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

import { IconSearch, IconEye, IconDownload } from "@tabler/icons-react";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { styled } from "@mui/material/styles";
import AttendanceModel from "@/model/attendance";
import localDateFormatter from "@/utils/localDateFormatter";

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

type AttendanceTableProps = {
  paginationData?: {
    attendances: AttendanceModel[];
    total: number;
    page: number;
    limit: number;
  };
  onSearching?: (query: string) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onPageChanged?: (page: number) => void;
  onDownloadExcelClicked?: () => void;
  onViewDetailClicked?: (attendance: AttendanceModel) => void;
};

const AttendanceTable = ({
  paginationData,
  onSearching,
  onRowsPerPageChange,
  onPageChanged,
  onDownloadExcelClicked,
  onViewDetailClicked,
}: AttendanceTableProps) => {
  const attendances = paginationData?.attendances || [];
  const totalAttendances = paginationData?.total || 0;
  const page = (paginationData?.page || 1) - 1;
  const limit = paginationData?.limit || 10;

  return (
    <Card sx={{ height: "100%", maxHeight: "500px", maxWidth: "900px" }}>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center items-start">
          <div className="flex mb-4 md:mb-0 flex-grow mr-2 justify-between w-full">
            <div className="flex-grow">
              <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
                Daftar Kehadiran
              </Typography>
              <Typography variant="body1" color="gray">
                Berikut tamu yang telah melakukan presensi
              </Typography>
            </div>
            <div className="flex items-center">
              <div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={onDownloadExcelClicked}
                >
                  <IconDownload size={20} /> Download
                </Button>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 w-full">
            <RoundTextField
              placeholder="Cari presensi"
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
        </div>
        <Box>
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table
              stickyHeader
              aria-label="simple table"
              sx={{
                width: "100%",
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
                      Waktu Kehadiran
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Lihat
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell align="center">
                      <Avatar alt="person image" />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ maxWidth: "200px", overflow: "hidden" }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        sx={{
                          lineClamp: 1,
                          WebkitLineClamp: 1,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {attendance.guest.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ maxWidth: "150px", overflow: "hidden" }}
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
                        {attendance.guest.key}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        <Chip
                          color={
                            attendance.guest.gender === "male"
                              ? "success"
                              : "info"
                          }
                          label={
                            attendance.guest.gender === "male"
                              ? "Laki-Laki"
                              : "Perempuan"
                          }
                        />
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
                        {attendance.guest.email ? attendance.guest.email : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {attendance.guest.phone ? attendance.guest.phone : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {localDateFormatter(new Date(attendance.time))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="view qr"
                        onClick={() => {
                          if (onViewDetailClicked) {
                            onViewDetailClicked(attendance);
                          }
                        }}
                      >
                        <IconEye size={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack
            sx={{ marginTop: 5 }}
            direction="row"
            justifyContent="end"
            alignItems="center"
          >
            <TablePagination
              component="div"
              count={totalAttendances}
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
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;

package com.nelli.smart_campus_operations_hub.service;

import com.nelli.smart_campus_operations_hub.enums.TicketStatus;
import com.nelli.smart_campus_operations_hub.model.Booking;
import com.nelli.smart_campus_operations_hub.model.Comment;
import com.nelli.smart_campus_operations_hub.model.Ticket;
import com.nelli.smart_campus_operations_hub.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends asynchronous HTML email notifications. Email delivery is best-effort and non-blocking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    // --- HTML UI Constants ---
    private static final String BTN_STYLE = "display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #0056b3; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;";
    private static final String TABLE_STYLE = "width: 100%; border-collapse: collapse; margin-top: 15px;";
    private static final String TH_STYLE = "text-align: left; padding: 8px; border-bottom: 1px solid #ddd; color: #555; width: 120px;";
    private static final String TD_STYLE = "padding: 8px; border-bottom: 1px solid #ddd; color: #222;";

    /**
     * Sends booking approved email.
     *
     * @param user recipient
     * @param booking related booking
     */
    @Async
    public void sendBookingApprovedEmail(User user, Booking booking) {
        String facilityName = safe(booking != null && booking.getFacility() != null ? booking.getFacility().getName() : null);

        String body = """
                <p>Hello %s,</p>
                <p>Great news! Your facility booking request has been <strong>approved</strong>.</p>
                <table style="%s">
                    <tr><th style="%s">Facility:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Start Time:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">End Time:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Purpose:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Attendees:</th><td style="%s">%s</td></tr>
                </table>
                <a href="%s/bookings" style="%s">View Booking Details</a>
                """.formatted(
                safe(user.getName()), TABLE_STYLE,
                TH_STYLE, TD_STYLE, facilityName,
                TH_STYLE, TD_STYLE, safe(booking != null ? booking.getStartDateTime() : null),
                TH_STYLE, TD_STYLE, safe(booking != null ? booking.getEndDateTime() : null),
                TH_STYLE, TD_STYLE, safe(booking != null ? booking.getPurpose() : null),
                TH_STYLE, TD_STYLE, safe(booking != null ? booking.getExpectedAttendees() : null),
                frontendUrl, BTN_STYLE
        );

        sendHtmlEmail(user.getEmail(), "Booking Approved - " + facilityName, body);
    }

    /**
     * Sends booking rejected email.
     *
     * @param user recipient
     * @param booking related booking
     */
    @Async
    public void sendBookingRejectedEmail(User user, Booking booking) {
        String facilityName = safe(booking != null && booking.getFacility() != null ? booking.getFacility().getName() : null);

        String body = """
                <p>Hello %s,</p>
                <p>We regret to inform you that your facility booking request has been <strong>rejected</strong>.</p>
                <table style="%s">
                    <tr><th style="%s">Facility:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Start Time:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Reason:</th><td style="%s; color: #d9534f;">%s</td></tr>
                </table>
                <a href="%s/bookings" style="%s; background-color: #6c757d;">View Booking</a>
                """.formatted(
                safe(user.getName()), TABLE_STYLE,
                TH_STYLE, TD_STYLE, facilityName,
                TH_STYLE, TD_STYLE, safe(booking != null ? booking.getStartDateTime() : null),
                TH_STYLE, TD_STYLE, safe(booking != null ? booking.getRejectionReason() : null),
                frontendUrl, BTN_STYLE
        );

        sendHtmlEmail(user.getEmail(), "Booking Rejected - " + facilityName, body);
    }

    /**
     * Sends ticket status update email.
     *
     * @param user recipient
     * @param ticket ticket
     * @param status new status
     */
    @Async
    public void sendTicketStatusEmail(User user, Ticket ticket, TicketStatus status) {
        String ticketNum = safe(ticket != null ? ticket.getTicketNumber() : null);
        String category = safe(ticket != null ? ticket.getCategory() : null);
        String facilityName = safe(ticket != null && ticket.getFacility() != null ? ticket.getFacility().getName() : null);

        String body = """
                <p>Hello %s,</p>
                <p>There is an update on your support ticket <strong>%s</strong>.</p>
                <table style="%s">
                    <tr><th style="%s">Status:</th><td style="%s; font-weight: bold; color: #0056b3;">%s</td></tr>
                    <tr><th style="%s">Category:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Facility:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Resolution:</th><td style="%s">%s</td></tr>
                </table>
                <a href="%s/tickets" style="%s">View Ticket</a>
                """.formatted(
                safe(user.getName()), ticketNum, TABLE_STYLE,
                TH_STYLE, TD_STYLE, safe(status),
                TH_STYLE, TD_STYLE, category,
                TH_STYLE, TD_STYLE, facilityName,
                TH_STYLE, TD_STYLE, safe(ticket != null ? ticket.getResolutionNotes() : null),
                frontendUrl, BTN_STYLE
        );

        sendHtmlEmail(user.getEmail(), "Ticket Status Updated: " + ticketNum, body);
    }

    /**
     * Sends technician assignment email.
     *
     * @param user technician recipient
     * @param ticket assigned ticket
     */
    @Async
    public void sendTicketAssignedEmail(User user, Ticket ticket) {
        String ticketNum = safe(ticket != null ? ticket.getTicketNumber() : null);
        String reportedByName = safe(ticket != null && ticket.getReportedBy() != null ? ticket.getReportedBy().getName() : null);
        String facilityName = safe(ticket != null && ticket.getFacility() != null ? ticket.getFacility().getName() : null);

        String body = """
                <p>Hello %s,</p>
                <p>A new maintenance/support ticket has been assigned to you.</p>
                <table style="%s">
                    <tr><th style="%s">Ticket #:</th><td style="%s"><strong>%s</strong></td></tr>
                    <tr><th style="%s">Priority:</th><td style="%s; color: #d9534f; font-weight: bold;">%s</td></tr>
                    <tr><th style="%s">Category:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Facility:</th><td style="%s">%s</td></tr>
                    <tr><th style="%s">Reported By:</th><td style="%s">%s</td></tr>
                </table>
                <div style="margin-top: 15px; padding: 15px; background-color: #f1f1f1; border-left: 4px solid #0056b3;">
                    <strong>Description:</strong><br/>
                    %s
                </div>
                <a href="%s/tickets" style="%s">Open Ticket Workspace</a>
                """.formatted(
                safe(user.getName()), TABLE_STYLE,
                TH_STYLE, TD_STYLE, ticketNum,
                TH_STYLE, TD_STYLE, safe(ticket != null ? ticket.getPriority() : null),
                TH_STYLE, TD_STYLE, safe(ticket != null ? ticket.getCategory() : null),
                TH_STYLE, TD_STYLE, facilityName,
                TH_STYLE, TD_STYLE, reportedByName,
                safe(ticket != null ? ticket.getDescription() : null),
                frontendUrl, BTN_STYLE
        );

        sendHtmlEmail(user.getEmail(), "New Ticket Assignment: " + ticketNum, body);
    }

    /**
     * Sends new ticket comment email.
     *
     * @param user recipient
     * @param comment comment
     * @param ticket ticket
     */
    @Async
    public void sendNewCommentEmail(User user, Comment comment, Ticket ticket) {
        String content = comment == null ? "" : comment.getContent();
        if (content != null && content.length() > 160) {
            content = content.substring(0, 160) + "...";
        }

        String ticketNum = safe(ticket != null ? ticket.getTicketNumber() : null);
        String authorName = safe(comment != null && comment.getUser() != null ? comment.getUser().getName() : null);

        String body = """
                <p>Hello %s,</p>
                <p><strong>%s</strong> has left a new comment on ticket <strong>%s</strong>:</p>
                <div style="margin: 15px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-style: italic;">
                    "%s"
                </div>
                <a href="%s/tickets" style="%s">Reply to Comment</a>
                """.formatted(
                safe(user.getName()), authorName, ticketNum,
                safe(content), frontendUrl, BTN_STYLE
        );

        sendHtmlEmail(user.getEmail(), "New Comment on Ticket: " + ticketNum, body);
    }

    /**
     * Sends weekly digest email with upcoming bookings and active tickets.
     *
     * @param user user recipient
     * @param upcomingBookings upcoming bookings
     * @param activeTickets active tickets
     */
    @Async
    public void sendWeeklyDigest(User user, List<Booking> upcomingBookings, List<Ticket> activeTickets) {
        String body = """
                <p>Hello %s,</p>
                <p>Here is your weekly summary from NELLi generated on %s.</p>
                <table style="%s">
                    <tr>
                        <td style="padding: 15px; background-color: #e3f2fd; text-align: center; border-radius: 8px; width: 50%%;">
                            <h2 style="margin: 0; color: #0056b3;">%d</h2>
                            <span style="color: #555;">Upcoming Bookings</span>
                        </td>
                        <td style="padding: 15px; background-color: #fff3cd; text-align: center; border-radius: 8px; width: 50%%;">
                            <h2 style="margin: 0; color: #856404;">%d</h2>
                            <span style="color: #555;">Active Tickets</span>
                        </td>
                    </tr>
                </table>
                <div style="text-align: center;">
                    <a href="%s/dashboard" style="%s">Open My Dashboard</a>
                </div>
                """.formatted(
                safe(user.getName()), LocalDateTime.now().toLocalDate().toString(),
                TABLE_STYLE,
                (upcomingBookings == null ? 0 : upcomingBookings.size()),
                (activeTickets == null ? 0 : activeTickets.size()),
                frontendUrl, BTN_STYLE
        );

        sendHtmlEmail(user.getEmail(), "Your Weekly NELLi Digest", body);
    }

    /**
     * Sends daily admin digest email for pending workload.
     *
     * @param admin admin recipient
     * @param pendingBookings pending bookings
     * @param unassignedTickets unassigned tickets
     */
    @Async
    public void sendDailyAdminDigest(User admin, List<Booking> pendingBookings, List<Ticket> unassignedTickets) {
        String body = """
                <p>Hello Admin %s,</p>
                <p>Here is your daily system overview generated on %s.</p>
                <table style="%s">
                    <tr>
                        <td style="padding: 15px; background-color: #f8d7da; text-align: center; border-radius: 8px; width: 50%%;">
                            <h2 style="margin: 0; color: #721c24;">%d</h2>
                            <span style="color: #555;">Pending Bookings</span>
                        </td>
                        <td style="padding: 15px; background-color: #d1ecf1; text-align: center; border-radius: 8px; width: 50%%;">
                            <h2 style="margin: 0; color: #0c5460;">%d</h2>
                            <span style="color: #555;">Unassigned Tickets</span>
                        </td>
                    </tr>
                </table>
                <div style="text-align: center;">
                    <a href="%s/admin" style="%s">Open Admin Panel</a>
                </div>
                """.formatted(
                safe(admin.getName()), LocalDateTime.now().toLocalDate().toString(),
                TABLE_STYLE,
                (pendingBookings == null ? 0 : pendingBookings.size()),
                (unassignedTickets == null ? 0 : unassignedTickets.size()),
                frontendUrl, BTN_STYLE
        );

        sendHtmlEmail(admin.getEmail(), "NELLi Daily Admin Digest", body);
    }

    /**
     * Master template builder containing the NELLi Branding.
     */
    private String buildHtmlEmail(String subject, String body) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        
                        <div style="background-color: #004080; color: #ffffff; padding: 20px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">NELLi</h1>
                            <span style="font-size: 14px; opacity: 0.9;">Smart Campus Operations Hub</span>
                        </div>
                        
                        <div style="padding: 30px; color: #333333; line-height: 1.6;">
                            <h2 style="color: #004080; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">%s</h2>
                            %s
                        </div>
                        
                        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; color: #888888; font-size: 12px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0;">This is an automated notification from the NELLi platform.<br/>Please do not reply directly to this email.</p>
                            <p style="margin: 5px 0 0 0;">&copy; %s NELLi Smart Campus. All rights reserved.</p>
                        </div>
                        
                    </div>
                </body>
                </html>
                """.formatted(safe(subject), body, LocalDateTime.now().getYear());
    }

    private void sendHtmlEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildHtmlEmail(subject, body), true);
            mailSender.send(message);
            log.info("Email sent successfully. to={}, subject={}", to, subject);
        } catch (MailException | MessagingException ex) {
            log.error("Email send failed. to={}, subject={}, error={}", to, subject, ex.getMessage());
        }
    }

    private String safe(Object value) {
        return value == null ? "N/A" : String.valueOf(value);
    }
}